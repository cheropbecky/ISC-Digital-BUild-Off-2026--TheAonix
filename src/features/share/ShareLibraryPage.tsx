/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Share Hub: Notes Library (/share)
 * Features: Filters, search, bookmarks, ratings, download counter
 * Demo Flow 4: Class rep / Lecturer approval trigger
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Star,
  CheckCircle,
  Plus,
  ShieldAlert,
  Clock,
  Sparkles,
  Filter,
} from 'lucide-react';
import { formatBytes } from '../../lib/utils';
import { DocumentItem } from '../../lib/types';

export const ShareLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents, toggleBookmark, approveDocument, user } = useKampasStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  const canApprove = PERMISSIONS.canApproveDocuments(user.role);

  const pendingDocs = documents.filter((d) => d.status === 'pending');
  const approvedDocs = documents.filter((d) => d.status === 'approved');

  const filteredDocs = approvedDocs.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.unitCode.toLowerCase().includes(search.toLowerCase()) ||
      d.uploaderName.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesBookmarked = !onlyBookmarked || d.isBookmarked;

    return matchesSearch && matchesCat && matchesBookmarked;
  });

  const handleDownload = (doc: DocumentItem) => {
    doc.downloadCount += 1;
    // Trigger sample blob download
    const dummyContent = `UEAB Academic Resource: ${doc.title}\nCourse: ${doc.unitCode}\nUploaded by: ${doc.uploaderName}\nVerified by Class Rep & Faculty Directorate.`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.unitCode}_${doc.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
              Academic Share Hub
            </h1>
            <Badge variant="academic">Peer Verified</Badge>
          </div>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            Lecture notes, summaries, past papers & lab manuals. Verified by Baraton Class Representatives.
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
                <div>
                  <div className="font-bold text-[#071B4A] dark:text-white">
                    [{doc.unitCode}] {doc.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Uploaded by {doc.uploaderName} • {formatBytes(doc.fileSizeBytes)} • {doc.category}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes, course codes, topics..."
            className="w-full h-10 pl-10 pr-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F2B705]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              onlyBookmarked
                ? 'bg-[#0B2A6F] text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-current' : ''}`} />
            <span>Saved Only</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-[#0B2A6F] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <Card key={doc.id} padding="md" hoverable className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-black text-[#0B2A6F] dark:text-[#93C5FD] tracking-wider uppercase">
                  {doc.unitCode}
                </span>
                <button
                  onClick={() => toggleBookmark(doc.id)}
                  className="text-slate-400 hover:text-[#F2B705] p-1 transition"
                  title="Bookmark document"
                >
                  <Bookmark
                    className={`w-4 h-4 ${doc.isBookmarked ? 'fill-[#F2B705] text-[#F2B705]' : ''}`}
                  />
                </button>
              </div>

              <h3 className="text-sm font-bold text-[#071B4A] dark:text-white line-clamp-2 mb-1.5 leading-snug">
                {doc.title}
              </h3>

              <p className="text-xs text-[#5B6475] dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                {doc.description}
              </p>

              {/* Metadata strip */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2.5 mb-4">
                <span>By {doc.uploaderName}</span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{doc.averageRating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({doc.ratingCount})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-mono text-slate-400">
                {formatBytes(doc.fileSizeBytes)} • {doc.downloadCount} dl
              </span>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleDownload(doc)}
                className="text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
