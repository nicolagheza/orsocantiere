"use client";

import { Tables } from "@/utils/supabase/database.types";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  VisibilityState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { SlidersHorizontal, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { deleteCantiere } from "../actions";

type Cantiere = Tables<"cantieri">;

interface CantieriTableProps {
  data: Cantiere[];
}

const CantieriTable: React.FC<CantieriTableProps> = ({ data }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const cantiereKeys = Object.keys(data[0] || {}) as Array<keyof Cantiere>;
  const columnHelper = createColumnHelper<Cantiere>();

  // We now handle deletion directly in the button onClick handler

  const columns = useMemo(() => {
    // Create basic columns from cantiere keys
    const basicColumns = cantiereKeys.map((key) =>
      columnHelper.accessor(key, {
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
        cell: (info) => {
          // Special handling for cliente_id to possibly show related client info
          if (key === "cliente_id" && info.getValue()) {
            return (info.row.original as any).cliente?.denominazione || "-";
          }
          return info.getValue()?.toString() || "-";
        },
      }),
    );

    // Add actions column
    const actionsColumn = columnHelper.display({
      id: "actions",
      header: "Azioni",
      cell: ({ row }) => {
        const cantiere = row.original;
        const isDeleting = deletingId === cantiere.id;
        
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/cantieri/${cantiere.id}`);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/cantieri/${cantiere.id}/edit`);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Questa azione non può essere annullata. Questo eliminerà
                    permanentemente il cantiere "{cantiere.nome}" e tutti i
                    dati associati.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <Button
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={async () => {
                      setDeletingId(cantiere.id);
                      try {
                        const formData = new FormData();
                        formData.append("id", cantiere.id);
                        const result = await deleteCantiere(formData);
                        if (result.success) {
                          router.refresh();
                        }
                      } catch (error) {
                        console.error("Error deleting cantiere:", error);
                      } finally {
                        setDeletingId(null);
                      }
                    }}
                  >
                    {isDeleting ? "Eliminazione..." : "Elimina"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    });

    return [...basicColumns, actionsColumn];
  }, [deletingId, router, cantiereKeys]);

  const defaultVisibility = cantiereKeys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: false,
    }),
    {},
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    ...defaultVisibility,
    nome: true,
    cliente_id: true,
    created_at: true,
    actions: true,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href={"/cantieri/new"}>
          <Button>Nuovo cantiere</Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Colonne
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Seleziona colonne</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table.getAllLeafColumns().map((column) => {
              // Skip the actions column in the dropdown
              if (column.id === "actions") return null;
              
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id.replace(/_/g, " ")}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-900"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/cantieri/${row.original.id}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-gray-500">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CantieriTable;
