import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  FileCode,
  FolderCode,
  Search,
  ExternalLink,
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ANDROID_PROJECT_FILES, AndroidFileItem } from '../data/androidFiles';

export const AndroidProjectViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidFileItem>(
    ANDROID_PROJECT_FILES.find((f) => f.path.endsWith('MainActivity.kt')) ||
      ANDROID_PROJECT_FILES[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const filteredFiles = ANDROID_PROJECT_FILES.filter(
    (f) =>
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const rootFolder = zip.folder('BrownianMotionLab');

      if (rootFolder) {
        for (const file of ANDROID_PROJECT_FILES) {
          rootFolder.file(file.path, file.content);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'BrownianMotionLab_AndroidStudio.zip');
    } catch (err) {
      console.error('Failed to generate zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      {/* Header with Title and Download button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <FolderCode className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Android Studio Project Workspace
            </h3>
            <p className="text-xs text-slate-400">
              Kotlin 2.1 · Jetpack Compose · Material 3 · SDK 35 · Coroutines MVVM
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isZipping ? 'Bundling Zip...' : 'Download Project (.zip)'}</span>
        </button>
      </div>

      {/* Main dual pane: file list left, code viewer right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 min-h-[440px]">
        {/* File Explorer sidebar */}
        <div className="md:col-span-4 bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 flex flex-col gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter project files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 placeholder-slate-400 text-xs pl-8 pr-2 py-1.5 rounded border border-slate-800 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto max-h-[380px] flex flex-col gap-0.5">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              const fileName = file.path.split('/').pop() || file.path;
              const dirPath = file.path.substring(0, file.path.lastIndexOf('/'));

              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-start gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <FileCode
                    className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                      isSelected ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <div className="flex flex-col truncate">
                    <span className="font-mono truncate">{fileName}</span>
                    {dirPath && (
                      <span className="text-[10px] text-slate-400 truncate font-mono">
                        {dirPath}/
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content View */}
        <div className="md:col-span-8 bg-slate-950 border border-slate-800 rounded-lg flex flex-col overflow-hidden">
          {/* File bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="font-mono text-cyan-300 truncate">{selectedFile.path}</span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                ({selectedFile.description})
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors cursor-pointer border border-slate-700 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax text block */}
          <div className="p-3 overflow-auto max-h-[380px] font-mono text-xs text-slate-200 leading-relaxed">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
