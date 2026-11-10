import { createWorker } from 'tesseract.js';
import type { TimetableEntry } from '../data/timetable';
import type { VenueData } from '../data/venues';

type W = { text: string; bbox: { x0: number; y0: number; x1: number; y1: number } };

const DAY_MAP: Record<string, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
  thu: 'Thursday', fri: 'Friday', sat: 'Saturday',
};
const PALETTE = ['#2563EB', '#16A34A', '#9333EA', '#EA580C', '#0891B2', '#DB2777', '#CA8A04'];
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// Works with tesseract.js v5 (data.words / data.lines) and v6+ (data.blocks)
const flattenWords = (data: any): W[] => {
  if (data?.words?.length) return data.words;
  const out: W[] = [];
  data?.lines?.forEach((l: any) => l.words?.forEach((w: any) => out.push(w)));
  if (out.length) return out;
  data?.blocks?.forEach((b: any) =>
    b.paragraphs?.forEach((p: any) =>
      p.lines?.forEach((l: any) => l.words?.forEach((w: any) => out.push(w)))));
  return out;
};

// Small screenshot text reads far better when upscaled
const upscale = (src: string): Promise<{ url: string; scale: number }> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = img.width > 1800 ? 1 : 2;
      const c = document.createElement('canvas');
      c.width = img.width * scale;
      c.height = img.height * scale;
      const ctx = c.getContext('2d')!;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, c.width, c.height);
      resolve({ url: c.toDataURL('image/png'), scale });
    };
    img.onerror = reject;
    img.src = src;
  });

const lev = (a: string, b: string) => {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
  return dp[a.length][b.length];
};

// Tolerates one OCR typo in header words (e.g. "Lecturer" -> "Lecturar")
const isLabel = (text: string, label: string) => {
  const t = text.toLowerCase().replace(/[^a-z]/g, '');
  if (!t) return false;
  if (t === label) return true;
  return label.length >= 4 && Math.abs(t.length - label.length) <= 1 && lev(t, label) <= 1;
};

// Header words live in the top-most row; ignore matches further down the table
const findHeader = (words: W[], label: string, scale: number): W[] => {
  const m = words.filter((w) => isLabel(w.text, label));
  if (!m.length) return [];
  const minY = Math.min(...m.map((w) => w.bbox.y0));
  return m.filter((w) => w.bbox.y0 - minY < 25 * scale).sort((a, b) => a.bbox.x0 - b.bbox.x0);
};

// "OFAD3O6" -> "OFAD306"; returns null if it doesn't look like a course code
const fixCode = (raw: string): string | null => {
  const t = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const m = t.match(/^([A-Z]{3,4})([A-Z0-9]{3,4})$/);
  if (!m) return null;
  const digits = m[2].replace(/O/g, '0').replace(/[IL]/g, '1').replace(/S/g, '5').replace(/B/g, '8');
  return /^\d{3,4}$/.test(digits) ? m[1] + digits : null;
};

const parseTime = (text: string) => {
  const fixed = text.replace(/[Oo]/g, '0').replace(/[lI|]/g, '1');
  const m = fixed.match(/(\d{1,2})\s*[:.]\s*(\d{2})/);
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : null;
};

const buildColumns = (words: W[], scale: number) => {
  const courses = findHeader(words, 'course', scale);
  const get = (l: string) => findHeader(words, l, scale)[0];
  const h = {
    code: courses[0],
    title: courses[1] ?? get('title'),
    credit: get('credit'),
    lecturer: get('lecturer'),
    room: get('room'),
    days: get('days'),
    start: get('start'),
    end: get('end'),
  };
  const missing = ['code', 'days', 'start', 'end'].filter((k) => !(h as any)[k]);
  if (missing.length) return { ok: false as const, missing, cols: [] as { key: string; x: number }[] };

  const cols = [
    { key: 'code', x: h.code.bbox.x0 },
    ...(h.lecturer ? [{ key: 'lecturer', x: h.lecturer.bbox.x0 }] : []),
    ...(h.room ? [{ key: 'room', x: h.room.bbox.x0 }] : []),
    { key: 'days', x: h.days.bbox.x0 },
    { key: 'start', x: h.start.bbox.x0 },
    { key: 'end', x: h.end.bbox.x0 },
  ];
  if (h.credit) cols.push({ key: 'credit', x: h.credit.bbox.x0 });
  if (h.title) cols.push({ key: 'title', x: h.title.bbox.x0 });
  else {
    const nextColumn = h.lecturer ?? h.room ?? h.days;
    cols.push({ key: 'title', x: h.code.bbox.x0 + (nextColumn.bbox.x0 - h.code.bbox.x0) * 0.25 });
  }
  cols.sort((a, b) => a.x - b.x);
  return { ok: true as const, missing: [] as string[], cols };
};

export async function scanTimetableImage(
  image: string,
  venues: VenueData[],
  onProgress: (p: number) => void
): Promise<TimetableEntry[]> {
  const { url, scale } = await upscale(image);

  const worker: any = await createWorker('eng', 1, {
    logger: (m: any) => m.status === 'recognizing text' && onProgress(m.progress),
  });

  const ocr = async (): Promise<W[]> => {
    let r = await worker.recognize(url);
    let w = flattenWords(r.data);
    if (!w.length) {
      // tesseract.js v6+ only returns what you ask for
      r = await worker.recognize(url, {}, { blocks: true, text: true });
      w = flattenWords(r.data);
    }
    return w.filter((x) => x.text?.trim());
  };

  let words: W[] = [];
  let built: ReturnType<typeof buildColumns> | null = null;

  try {
    // Try automatic layout first, then sparse-text mode (better for table cells)
    for (const mode of ['3', '11']) {
      await worker.setParameters({ tessedit_pageseg_mode: mode });
      words = await ocr();
      built = buildColumns(words, scale);
      if (built.ok) break;
    }
  } finally {
    await worker.terminate();
  }

  if (!built || !built.ok) {
    console.warn('[scanTimetable] header detection failed. Missing:', built?.missing);
    console.warn('[scanTimetable] OCR words:', words.map((w) => w.text).join(' | '));
    throw new Error('HEADER_NOT_FOUND');
  }

  const cols = built.cols;
  const tol = 10 * scale;
  const colOf = (w: W) => {
    let key: string | null = null; // null = the "#" column, ignored
    for (const c of cols) if (w.bbox.x0 >= c.x - tol) key = c.key;
    return key;
  };

  // Row anchors = course codes in the code column
  const anchors = words
    .filter((w) => colOf(w) === 'code' && fixCode(w.text))
    .sort((a, b) => a.bbox.y0 - b.bbox.y0);

  const lineTol = 8 * scale;
  const byReadingOrder = (a: W, b: W) =>
    Math.abs(a.bbox.y0 - b.bbox.y0) > lineTol ? a.bbox.y0 - b.bbox.y0 : a.bbox.x0 - b.bbox.x0;

  const matchVenue = (room: string) => {
    const r = norm(room);
    return venues.find((v: any) => {
      const c = norm(v.code ?? '');
      const n = norm(v.name ?? '');
      return (c.length >= 3 && r.includes(c)) || (n.length >= 3 && (r.includes(n) || n.includes(r)));
    }) as any;
  };

  const results: TimetableEntry[] = [];
  const colorByCode = new Map<string, string>();

  anchors.forEach((anchor, i) => {
    const yStart = anchor.bbox.y0 - 10 * scale;
    const yEnd = anchors[i + 1] ? anchors[i + 1].bbox.y0 - 10 * scale : Infinity;
    const band = words.filter((w) => w.bbox.y0 >= yStart && w.bbox.y0 < yEnd);

    const text = (key: string) =>
      band.filter((w) => colOf(w) === key).sort(byReadingOrder).map((w) => w.text).join(' ').trim();

    const code = fixCode(anchor.text)!;
    const title = text('title');
    const lecturer = text('lecturer');
    const room = text('room');
    const startTime = parseTime(text('start'));
    const endTime = parseTime(text('end'));
    const days = Array.from(
      new Set((text('days').toLowerCase().match(/mon|tue|wed|thu|fri|sat/g) ?? []).map((d) => DAY_MAP[d]))
    );
    if (!startTime || !endTime || days.length === 0) return;

    if (!colorByCode.has(code)) colorByCode.set(code, PALETTE[colorByCode.size % PALETTE.length]);
    const venue = matchVenue(room);

    days.forEach((day) => {
      results.push({
        id: `scan-${code}-${day}-${startTime}`,
        unitCode: code,
        unitName: title,
        lecturer,
        dayOfWeek: day,
        startTime,
        endTime,
        venueId: venue?.id ?? '',
        venueName: venue?.name ?? room,
        venueCode: venue?.code ?? '',
        color: colorByCode.get(code)!,
        isRelocated: false,
      } as TimetableEntry);
    });
  });

  console.table(results);
  return results;
}
