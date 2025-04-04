"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  FileSpreadsheetIcon,
  MoreHorizontal,
  Trash2,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { format } from "date-fns";
import { it } from "date-fns/locale";

// File entity type enum
export type EntityType = "cantiere" | "cliente" | "dipendente" | "tecnico";

// File category enum
export type FileCategory =
  | "documento"
  | "fattura"
  | "contratto"
  | "foto"
  | "altro";

interface FileRecord {
  id: string;
  name: string;
  created_at: string | null;
  entity_type: string; // Changed from EntityType to string to match database return type
  entity_id: string;
  category: string; // Changed from FileCategory to string to match database return type
  storage_path: string;
  size: number;
}

interface FileListProps {
  entityType: EntityType;
  entityId: string;
  title?: string;
}

export default function FileList({
  entityType,
  entityId,
  title = "Documenti",
}: FileListProps) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<{ [key: string]: boolean }>({});

  const supabase = createClient();

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Errore nel caricamento dei file");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [entityType, entityId]);

  const handleDelete = async (fileId: string, storagePath: string) => {
    try {
      setDeleting((prev) => ({ ...prev, [fileId]: true }));

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("files")
        .delete()
        .eq("id", fileId);

      if (dbError) throw dbError;

      // Update UI
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Si è verificato un errore durante l'eliminazione del file");
    } finally {
      setDeleting((prev) => {
        const newState = { ...prev };
        delete newState[fileId];
        return newState;
      });
    }
  };

  const handleDownload = async (file: FileRecord) => {
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .download(file.storage_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Si è verificato un errore durante il download del file");
    }
  };

  const getFileIcon = (category: string, fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (category) {
      case "documento":
        return <FileTextIcon className="h-6 w-6 text-blue-500" />;
      case "fattura":
        return <FileSpreadsheetIcon className="h-6 w-6 text-green-500" />;
      case "contratto":
        return <FileIcon className="h-6 w-6 text-purple-500" />;
      case "foto":
        return <ImageIcon className="h-6 w-6 text-amber-500" />;
      default:
        if (extension === "pdf")
          return <FileIcon className="h-6 w-6 text-red-500" />;
        if (["jpg", "jpeg", "png"].includes(extension || ""))
          return <ImageIcon className="h-6 w-6 text-amber-500" />;
        return <FileIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "documento":
        return "Documento";
      case "fattura":
        return "Fattura";
      case "contratto":
        return "Contratto";
      case "foto":
        return "Foto";
      case "altro":
        return "Altro";
      default:
        return category; // Return the category as is if it doesn't match predefined values
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Data non disponibile";
    try {
      return format(new Date(dateString), "d MMM yyyy", { locale: it });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Data non valida";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">Caricamento documenti...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {files.length > 0 ? (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.category, file.name)}
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>{getCategoryLabel(file.category)}</span>
                      <span>•</span>
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{formatDate(file.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(file)}
                    title="Scarica"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDelete(file.id, file.storage_path)}
                        disabled={deleting[file.id]}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deleting[file.id] ? "Eliminazione..." : "Elimina"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nessun documento disponibile
          </div>
        )}
      </CardContent>
    </Card>
  );
}
