// components/FileUploader.tsx
// Written by Nicola Gheza 2025
// https://nicolagheza.com

import { createClient } from "@/utils/supabase/client";
import { useState, ChangeEvent } from "react";

type AllowedMimeTypes =
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const allowedTypes: Record<AllowedMimeTypes, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const supabase = createClient();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!file) return;

    const isValidFileType = (file: File): boolean => {
      return Object.keys(allowedTypes).includes(file.type);
    };

    // Add this check before upload
    if (!isValidFileType(file)) {
      alert("Invalid file type");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 50MB limit");
      return;
    }

    try {
      setUploading(true);

      const { error } = await supabase.storage
        .from("documents")
        .upload(`public/${file.name}`, file);

      if (error) throw error;
      alert("File uploaded successfully!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-busy={uploading}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
}
