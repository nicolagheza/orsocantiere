"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, ChangeEvent } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { EntityType, FileCategory } from "./FileList";

type AllowedMimeTypes =
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "image/jpeg"
  | "image/png";

const allowedTypes: Record<AllowedMimeTypes, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

const fileCategories: { value: FileCategory; label: string }[] = [
  { value: "documento", label: "Documento" },
  { value: "fattura", label: "Fattura" },
  { value: "contratto", label: "Contratto" },
  { value: "foto", label: "Foto" },
  { value: "altro", label: "Altro" },
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface FileUploaderProps {
  entityType: EntityType;
  entityId: string;
  entityName?: string;
}

export default function FileUploader({
  entityType,
  entityId,
  entityName,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [category, setCategory] = useState<FileCategory>("documento");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const isValidFileType = (file: File): boolean => {
    return Object.keys(allowedTypes).includes(file.type as AllowedMimeTypes);
  };

  const handleUpload = async (): Promise<void> => {
    if (!file) {
      setError("Seleziona un file da caricare");
      return;
    }

    if (!isValidFileType(file)) {
      setError(
        "Tipo di file non valido. Formati supportati: PDF, DOC, DOCX, JPG, PNG",
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("La dimensione del file supera il limite di 50MB");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      // Create a unique file path for storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${entityType}/${entityId}/${Date.now()}-${file.name}`;

      // Upload file to Supabase Storage
      const { error: storageError, data } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (storageError) throw storageError;

      // Add file record to database
      const { error: dbError } = await supabase.from("files").insert({
        name: file.name,
        entity_type: entityType,
        entity_id: entityId,
        category: category,
        storage_path: filePath,
        size: file.size,
      });

      if (dbError) throw dbError;

      setSuccess("File caricato con successo!");
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById(
        "file-upload",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Si è verificato un errore durante il caricamento");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Carica Documenti</CardTitle>
        {entityName && <p className="text-sm text-gray-500">{entityName}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="file-category"
              className="block text-sm font-medium mb-2"
            >
              Categoria del file
            </label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as FileCategory)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleziona una categoria" />
              </SelectTrigger>
              <SelectContent>
                {fileCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium mb-2"
            >
              Seleziona file
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formati supportati: PDF, DOC, DOCX, JPG, PNG (max 50MB)
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="w-full sm:w-auto"
          >
            {uploading ? "Caricamento in corso..." : "Carica File"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
