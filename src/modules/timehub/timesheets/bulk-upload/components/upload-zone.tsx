"use client";

import { useState, useRef, useEffect } from "react";
import { CloudUpload, Check } from "lucide-react";
import { toast } from "sonner";

export type UploadZoneProps = {
  file: File | null;
  onFileProcess: (file: File) => void;
  onRemoveFile: () => void;
};

export function UploadZone({ file, onFileProcess, onRemoveFile }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!file && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      onFileProcess(selected);
    }
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemoveFile();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    if (
      !droppedFile.name.endsWith(".xlsx") &&
      !droppedFile.name.endsWith(".xls")
    ) {
      toast.error("Only Excel files are supported.");
      return;
    }

    onFileProcess(droppedFile);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border border-dashed rounded-md p-8 text-center transition-all group relative cursor-pointer ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-[#D9E7F2] hover:bg-slate-50"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".xls,.xlsx"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
          <div className="w-12 h-12 bg-blue-100/50 rounded-full flex items-center justify-center mb-1">
            <CloudUpload className="w-6 h-6 text-blue-500 transition-colors" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Drag &amp; Drop timesheet file</p>
            <p className="text-xs text-slate-400 mt-1">Supports Excel Files (.xls, .xlsx)</p>
          </div>
          <button
            type="button"
            className="pointer-events-none border border-[#D9E7F2] text-blue-600 rounded-md px-5 py-1.5 text-sm font-semibold bg-white"
          >
            Browse Files
          </button>
        </div>
      </div>

      {file && (
        <div className="grid grid-cols-1 gap-3 mt-4">
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border border-[#D9E7F2] rounded-md bg-[#F8FAFC]"
          >
            <div className="flex items-center gap-4">
              <div className="w-[18px] h-[18px] rounded-full bg-[#10b981] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
              <span className="text-[11px] font-bold text-[#1B1B24] tracking-tight break-all">
                {file.name}
              </span>
            </div>
            <div className="flex items-center gap-6 pl-[34px] sm:pl-0">
              <span className="text-[10px] text-[#464555] font-medium shrink-0">
                {(file.size / (1024 * 1024)).toFixed(1)} MB <span className="mx-0.5">•</span> Uploaded just now
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="text-[10px] font-bold text-[#BA1A1A] hover:text-[#9e1616] tracking-wide transition-colors shrink-0"
              >
                REMOVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
