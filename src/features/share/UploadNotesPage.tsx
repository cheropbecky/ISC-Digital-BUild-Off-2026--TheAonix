/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Document Upload Portal (/share/upload)
 * Features: Client file type validation, compression simulation,
 * restricted exam paper blocking rule, submission to approval queue
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  FileUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldAlert,
  ArrowLeft,
  X,
} from 'lucide-react';
import { DocumentItem } from '../../lib/types';

export const UploadNotesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, units, uploadDocument } = useKampasStore();

  const [title, setTitle] = useState('');
  const [unitCode, setUnitCode] = useState('COSC 311');
  const [category, setCategory] = useState<DocumentItem['category']>('lecture_notes');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExamPaper, setIsExamPaper] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: max 20MB
    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('File exceeds 20MB limit. Please compress your document.');
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please choose a PDF file so it can be previewed in the Share Hub.');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSize(file.size);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setErrorMsg('Attach a PDF file before submitting this resource.');
      return;
    }

    // Enforce Rule: Block documents marked as restricted exam papers
    if (isExamPaper && category === 'past_paper') {
      const isRestricted = title.toLowerCase().includes('final') || title.toLowerCase().includes('trimester 1 2026');
      if (isRestricted) {
        setErrorMsg('Security Policy Alert: Current trimester upcoming examination papers cannot be uploaded to public share hubs.');
        return;
      }
    }

    setIsUploading(true);

    setTimeout(() => {
      uploadDocument({
        title,
        unitCode,
        description,
        fileUrl: URL.createObjectURL(selectedFile),
        fileName: selectedFile.name,
        fileType: 'pdf',
        fileSizeBytes: fileSize,
        uploadedByUserId: user.id,
        uploaderName: user.fullName,
        category,
        isExamPaper,
        isRestricted: false,
      });

      setIsUploading(false);
      navigate('/share');
    }, 700);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/share')}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#071B4A] dark:text-white">
            Upload Study Document
          </h1>
          <p className="text-xs text-[#5B6475] dark:text-slate-400">
            Share lecture notes, revision flashcards, or past papers with fellow Baraton students.
          </p>
        </div>
      </div>

      <Card padding="lg">
        {errorMsg && (
          <div className="p-3 mb-5 bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMsg}</div>
            <button onClick={() => setErrorMsg('')}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Compiler Grammar & AST Parser Notes"
              required
              className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B705]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
                Associated Course Unit
              </label>
              <select
                value={unitCode}
                onChange={(e) => setUnitCode(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B705]"
              >
                {units.map((u) => (
                  <option key={u.code} value={u.code}>
                    {u.code} - {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
                Material Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B705]"
              >
                <option value="lecture_notes">Lecture Notes</option>
                <option value="past_paper">Past Paper with Solutions</option>
                <option value="summary">Revision Summary</option>
                <option value="lab_manual">Lab Manual / Practical Guide</option>
                <option value="assignment_solution">Assignment Solutions</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
              Description & Topics Covered
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a concise description of chapters, theorems, or sample problems included..."
              required
              className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B705]"
            />
          </div>

          {/* File Picker Zone */}
          <div>
            <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
              Attach File (PDF - Max 20MB)
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-[#0B2A6F] transition cursor-pointer relative bg-slate-50/50 dark:bg-slate-900/50">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileUp className="w-8 h-8 text-[#0B2A6F] dark:text-[#F2B705] mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800 dark:text-white">
                {fileName ? fileName : 'Click or drag files here to upload'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Images are automatically compressed to ensure fast downloads on slow campus Wi-Fi.
              </p>
            </div>
          </div>

          {/* Academic Integrity Check */}
          <label className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={isExamPaper}
              onChange={(e) => setIsExamPaper(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-[#0B2A6F] rounded"
            />
            <div className="text-xs">
              <span className="font-bold text-[#071B4A] dark:text-white">
                Academic Integrity Confirmation
              </span>
              <p className="text-[11px] text-slate-500">
                I verify this material contains study notes or archived revision papers, and is not an unauthorized active exam leak.
              </p>
            </div>
          </label>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/share')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isUploading}
              disabled={!title || !description || !selectedFile}
            >
              Submit for Class Rep Verification
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
