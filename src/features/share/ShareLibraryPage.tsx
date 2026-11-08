/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Share Hub: Notes Library (/share)
 * Features: Filters, search, bookmarks, ratings, download counter
 * Demo Flow 4: Class rep / Lecturer approval trigger
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PERMISSIONS } from '../../lib/permissions';
import {
  FileText,
  Search,
  Bookmark,
  Download,
  Eye,
  Star,
  CheckCircle,
  Plus,
  Clock,
  X,
  BookOpen,
  Files,
  SlidersHorizontal,
} from 'lucide-react';
import { formatBytes } from '../../lib/utils';
import { DocumentItem } from '../../lib/types';
const getCourseCover = (unitCode: string) => {
  const code = unitCode.toUpperCase();
  const photo = (id: string) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

  if (code.startsWith('COSC 311')) {
    return { src: photo('photo-1461749280684-dccba630e2f6'), label: 'Compiler Design', alt: 'Computer screen displaying software code' };
  }
  if (code.startsWith('COSC 330')) {
    return { src: photo('photo-1558494949-ef010cbdcc31'), label: 'Database Systems', alt: 'Rows of servers in a data center' };
  }
  if (code.startsWith('COSC 420')) {
    return { src: photo('photo-1451187580459-43490279c0fa'), label: 'Software Architecture', alt: 'Connected digital systems viewed across the Earth' };
  }
  if (code.startsWith('NURS')) {
    return { src: photo('photo-1576091160399-112ba8d25d1d'), label: 'Nursing & Anatomy', alt: 'Healthcare professional studying a medical image' };
  }
  if (code.startsWith('ENGR')) {
    return { src: photo('photo-1518770660439-4636190af475'), label: 'Digital Logic', alt: 'Electronic circuit board with microprocessor components' };
  }
  if (code.startsWith('MATH')) {
    return { src: photo('photo-1509228468518-180dd4864904'), label: 'Linear Algebra', alt: 'Mathematics textbook and handwritten calculations' };
  }
  if (code.startsWith('RELT')) {
    return { src: photo('photo-1504052434569-70ad5836ab65'), label: 'Ethics & Theology', alt: 'Sunlight entering a quiet church interior' };
  }
  if (code.startsWith('BBA')) {
    return { src: photo('photo-1460925895917-afdab827c52f'), label: 'Business Management', alt: 'Business analytics dashboard on a laptop' };
  }
  if (code.startsWith('COMM')) {
    return { src: photo('photo-1455390582262-044cdead277a'), label: 'Scholarly Communication', alt: 'Student writing notes in a notebook' };
  }
  return { src: photo('photo-1503676260728-1c00da094a0b'), label: 'Course Study', alt: 'Students learning together in a classroom' };
};

const formatUploadedAt = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const categoryLabels: Record<DocumentItem['category'], string> = {
  lecture_notes: 'Lecture notes',
  past_paper: 'Past paper',
  assignment_solution: 'Solutions',
  summary: 'Revision summary',
  lab_manual: 'Lab manual',
};

const categoryStyles: Record<DocumentItem['category'], string> = {
  lecture_notes: 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200',
  past_paper: 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200',
  assignment_solution: 'bg-violet-50 text-violet-800 dark:bg-violet-950/50 dark:text-violet-200',
  summary: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200',
  lab_manual: 'bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
};

export const ShareLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents, toggleBookmark, approveDocument, incrementDocumentDownload, user } = useKampasStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  const canApprove = PERMISSIONS.canApproveDocuments(user.role);

  const pendingDocs = documents.filter((d) => d.status === 'pending');
  const approvedDocs = documents.filter((d) => d.status === 'approved');

  const filteredDocs = approvedDocs.filter((d) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [
      d.title,
      d.unitCode,
      d.uploaderName,
      d.description,
      d.category.replaceAll('_', ' '),
      d.fileType,
      d.fileName || d.fileUrl.split('/').pop() || '',
    ].some((value) => value.toLowerCase().includes(query));

    const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesBookmarked = !onlyBookmarked || d.isBookmarked;

    return matchesSearch && matchesCat && matchesBookmarked;
  });

  const getDocumentFileName = (doc: DocumentItem) =>
    doc.fileName || doc.fileUrl.split('/').pop() || `${doc.unitCode}-resource.${doc.fileType}`;

  const handleDownload = (doc: DocumentItem) => {
    incrementDocumentDownload(doc.id);
  };

  return (
    <div className="space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-xl border border-[#0B2A6F] bg-[#071B4A] text-white shadow-sm">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-[#0B2A6F] to-transparent sm:block" />
        <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#F2B705]">
              <BookOpen className="h-4 w-4" />
              UEAB · Academic resources
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-black leading-tight sm:text-3xl">Shared Notes Library</h1>
              <Badge variant="academic">Peer verified</Badge>
            </div>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-blue-100 sm:text-sm">
              Find course notes, revision papers and practical guides shared by the Baraton community.
            </p>
          </div>

          <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate('/share/groups')}
            className="text-xs"
          >
            Study Groups
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/share/upload')}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Upload Document
          </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-700 sm:grid-cols-4">
        {[
          { label: 'Available resources', value: approvedDocs.length, icon: Files },
          { label: 'Course units', value: new Set(approvedDocs.map((doc) => doc.unitCode)).size, icon: BookOpen },
          { label: 'Downloads', value: approvedDocs.reduce((total, doc) => total + doc.downloadCount, 0).toLocaleString(), icon: Download },
          { label: 'Needs review', value: pendingDocs.length, icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 bg-white px-4 py-3 dark:bg-slate-900">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#F7F9FC] text-[#0B2A6F] dark:bg-slate-800 dark:text-blue-300">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <div className="text-base font-black leading-tight text-[#071B4A] dark:text-white">{value}</div>
              <div className="mt-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">{label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Class Rep / Lecturer Pending Approvals Queue (Demo Flow 4) */}
      {canApprove && pendingDocs.length > 0 && (
        <Card className="border border-[#F2B705] bg-[#FEF3C7]/20 dark:bg-yellow-950/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D97706]" />
              <span className="text-xs font-bold text-[#071B4A] dark:text-white">
                Class Rep Approval Queue ({pendingDocs.length} pending review)
              </span>
            </div>
            <Badge variant="soon">Verification Required</Badge>
          </div>

          <div className="space-y-2">
            {pendingDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-white dark:bg-[#0C1D3D] rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={getCourseCover(doc.unitCode).src}
                    alt={getCourseCover(doc.unitCode).alt}
                    className="h-14 w-20 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0">
                  <div className="font-bold text-[#071B4A] dark:text-white">
                    [{doc.unitCode}] {doc.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Uploaded by {doc.uploaderName} • {formatBytes(doc.fileSizeBytes)} • {doc.category.replaceAll('_', ' ')}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Submitted {formatUploadedAt(doc.createdAt)}
                  </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => approveDocument(doc.id)}
                    className="text-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Approve for Class
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <section className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search notes and files"
            placeholder="Search titles, course codes, topics, file types..."
            className="h-10 w-full rounded-md border border-slate-200 bg-[#F7F9FC] pl-10 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0B2A6F] focus:ring-2 focus:ring-[#0B2A6F]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            aria-pressed={onlyBookmarked}
            className={`inline-flex h-10 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition ${
              onlyBookmarked
                ? 'border-[#0B2A6F] bg-[#0B2A6F] text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-current' : ''}`} />
            <span>Saved</span>
          </button>
          <span className="hidden items-center gap-1.5 px-2 text-[11px] text-slate-400 sm:inline-flex">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filter by type
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 overflow-x-auto border-t border-slate-100 pt-3 dark:border-slate-800">
        {[
          { id: 'all', label: 'All Documents' },
          { id: 'lecture_notes', label: 'Lecture Notes' },
          { id: 'past_paper', label: 'Past Papers' },
          { id: 'summary', label: 'Revision Summaries' },
          { id: 'lab_manual', label: 'Lab Manuals' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`min-h-9 rounded-md px-3 text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-[#0B2A6F] text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      </section>

      {/* Documents Grid */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredDocs.length} {filteredDocs.length === 1 ? 'resource' : 'resources'}</span>
        {search && <span className="truncate pl-3">Results for “{search}”</span>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredDocs.map((doc) => (
          <Card key={doc.id} padding="md" hoverable className="group flex min-h-[285px] flex-col justify-between border-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-[#9BB1D6] hover:shadow-md dark:border-slate-700">
            <div className="relative -mx-4 -mt-4 mb-4 h-40 overflow-hidden rounded-t-lg sm:-mx-5 sm:-mt-5 sm:h-48">
              <img
                src={getCourseCover(doc.unitCode).src}
                alt={getCourseCover(doc.unitCode).alt}
                className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071B4A]/85 via-[#071B4A]/15 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white sm:left-5">
                <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#F2B705]">{getCourseCover(doc.unitCode).label}</div>
                <div className="mt-0.5 text-xs font-bold">{doc.unitCode} · Course resource</div>
              </div>
            </div>
            <div>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-[#F7F9FC] text-[#0B2A6F] dark:border-slate-700 dark:bg-slate-800 dark:text-blue-300">
                    <FileText className="h-6 w-6" strokeWidth={1.7} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#0B2A6F] dark:text-blue-300">{doc.unitCode}</div>
                    <span className={`mt-1 inline-flex rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${categoryStyles[doc.category]}`}>
                      {categoryLabels[doc.category]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleBookmark(doc.id)}
                  aria-label={doc.isBookmarked ? 'Remove bookmark' : 'Bookmark document'}
                  aria-pressed={Boolean(doc.isBookmarked)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-amber-50 hover:text-[#B58100] dark:hover:bg-amber-950/40"
                  title="Bookmark document"
                >
                  <Bookmark
                    className={`w-4 h-4 ${doc.isBookmarked ? 'fill-[#F2B705] text-[#F2B705]' : ''}`}
                  />
                </button>
              </div>

              <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-[#071B4A] dark:text-white">
                {doc.title}
              </h3>

              <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-[#5B6475] dark:text-slate-400">
                {doc.description}
              </p>

              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /><time dateTime={doc.createdAt}>{formatUploadedAt(doc.createdAt)}</time></span>
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="truncate">{doc.uploaderName}</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500 dark:border-slate-800">
                <span>{formatBytes(doc.fileSizeBytes)} <span className="text-slate-300 dark:text-slate-600">/</span> {doc.fileType.toUpperCase()}</span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{doc.averageRating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({doc.ratingCount})</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400">{doc.downloadCount.toLocaleString()} downloads</span>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setPreviewDoc(doc)}
                className="text-xs"
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Preview
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="border border-dashed border-slate-300 dark:border-slate-700 px-5 py-12 text-center">
          <Search className="mx-auto mb-3 h-8 w-8 text-slate-400" />
          <h2 className="text-sm font-bold text-[#071B4A] dark:text-white">No matching resources</h2>
          <p className="mt-1 text-xs text-slate-500">Try another search term or select a different category.</p>
        </div>
      )}

      {previewDoc && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/70 p-3 sm:p-6 flex items-center justify-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreviewDoc(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="document-preview-title"
            className="w-full max-w-5xl h-[min(88vh,900px)] bg-white dark:bg-slate-900 rounded-lg shadow-2xl flex flex-col overflow-hidden"
          >
            <header className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#0B2A6F] dark:text-blue-300">{previewDoc.unitCode} · {previewDoc.fileType}</div>
                <h2 id="document-preview-title" className="text-sm font-bold text-[#071B4A] dark:text-white mt-1 truncate">{previewDoc.title}</h2>
                <p className="text-[11px] text-slate-500 mt-1">{previewDoc.fileName || previewDoc.fileUrl.split('/').pop()} · Uploaded by {previewDoc.uploaderName} · {formatUploadedAt(previewDoc.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewDoc.fileUrl}
                  download={getDocumentFileName(previewDoc)}
                  onClick={() => handleDownload(previewDoc)}
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md bg-[#0B2A6F] text-white text-xs font-semibold hover:bg-[#071B4A]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  aria-label="Close file preview"
                  className="w-9 h-9 inline-flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>
            <div className="flex-1 min-h-0 bg-slate-100 dark:bg-slate-950">
              {previewDoc.fileType === 'pdf' || previewDoc.fileType === 'html' ? (
                <iframe
                  title={`Preview: ${previewDoc.title}`}
                  src={previewDoc.fileUrl}
                  referrerPolicy="no-referrer"
                  className="w-full h-full bg-white"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <FileText className="w-10 h-10 text-slate-400 mb-3" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Inline preview is unavailable for this format.</p>
                  <p className="text-xs text-slate-500 mt-1">{previewDoc.fileType.toUpperCase()} · {formatBytes(previewDoc.fileSizeBytes)}</p>
                  <a href={previewDoc.fileUrl} download={getDocumentFileName(previewDoc)} onClick={() => handleDownload(previewDoc)} className="mt-4 text-xs font-bold text-[#0B2A6F] dark:text-blue-300 underline">Download original file</a>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
