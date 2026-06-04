'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function ForestryUpload() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPEG, PNG, or WEBP images.');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 10MB limit.');
      return false;
    }
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 50;
      });
    }, 100);

    setTimeout(() => {
      setProgress(100);
      toast.success('Upload complete! Analyzing imagery...');
      setUploading(false);
      router.push('/forestry/results');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Forestry Analysis" description="Upload satellite imagery for tree analysis" />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer p-12 transition-colors',
          isDragOver ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-muted-foreground/25 hover:border-muted-foreground/40'
        )}
      >
        <input ref={fileInputRef} type="file" accept={ACCEPTED_IMAGE_TYPES.join(',')} onChange={handleInputChange} className="hidden" />
        <Upload className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-lg font-medium">Drag & drop satellite imagery here</p>
        <p className="text-sm text-muted-foreground mt-1">or click to select (JPEG, PNG, WEBP up to 10MB)</p>
      </div>

      {selectedFile && (
        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-4">
            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-64 object-cover rounded-md" />
            <div className="space-y-1">
              <p className="text-sm"><span className="font-medium">File:</span> {selectedFile.name}</p>
              <p className="text-sm"><span className="font-medium">Size:</span> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Uploading...</span>
                  <span className="text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-200 rounded-full"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          {!uploading && (
            <Button onClick={handleUpload} size="lg" className="w-full">
              Upload and Analyze
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
