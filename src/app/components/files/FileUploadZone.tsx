
import React, { useState, useCallback } from "react";
import { UploadFile } from "@/integrations/Core";
import { Card } from "../ui/card";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface FileUploadZoneProps {
  onFilesUploaded: (files: any[]) => void;
  productionId: string | null;
}

export default function FileUploadZone({ onFilesUploaded, productionId }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  const processFiles = useCallback(async (files: File[]) => {
    setUploading(true);
    setUploadedCount(0);

    const uploadedFiles = [];

    for (const file of files) {
      try {
        const { file_url } = await UploadFile({ file });
        uploadedFiles.push({
          name: file.name,
          file_url,
          file_type: "other",
          file_size: file.size,
          mime_type: file.type
        });
        setUploadedCount(prev => prev + 1);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    await onFilesUploaded(uploadedFiles);
    setUploading(false);
    setUploadedCount(0);
  }, [onFilesUploaded, productionId]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  }, [processFiles]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
  };

  return (
    <Card
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
        dragActive 
          ? "border-[#10b981] bg-[#10b981]/10" 
          : "border-gray-800 bg-[#1e293b] hover:border-[#0d9488]"
      }`}
    >
      <input
        type="file"
        multiple
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
        disabled={uploading}
      />

      <label htmlFor="file-upload" className="cursor-pointer block">
        <div className="text-center">
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-[#10b981] animate-spin" />
              <p className="text-[#fafaf9] font-semibold mb-2">
                Uploading files... {uploadedCount} completed
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-[#065f46]/20 rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-[#10b981]" />
              </div>
              <h3 className="text-[#fafaf9] font-semibold mb-2 text-lg">
                Drop files here or click to upload
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Support for all document types
              </p>
              <Button 
                type="button"
                className="bg-gradient-to-r from-[#065f46] to-[#0d9488] hover:from-[#064e3b] hover:to-[#0f766e] text-[#fafaf9]"
              >
                Browse Files
              </Button>
            </>
          )}
        </div>
      </label>
    </Card>
  );
}
