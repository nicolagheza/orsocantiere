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
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";

type Cantiere = Tables<"cantieri">;

interface CantieriTableProps {
  data: Cantiere[];
}

const CantieriTable: React.FC<CantieriTableProps> = ({ data }) => {
  const router = useRouter();

  const cantiereKeys = Object.keys(data[0] || {}) as Array<keyof Cantiere>;
  const columnHelper = createColumnHelper<Cantiere>();

  const columns = useMemo(() => {
    return cantiereKeys.map((key) =>
      columnHelper.accessor(key, {
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
        cell: (info) => {
          // Special handling for cliente_id to possibly show related client info
          if (key === "cliente_id" && info.getValue()) {
            return info.row.original.cliente?.denominazione || "-";
          }
          return info.getValue()?.toString() || "-";
        },
      }),
    );
  }, []);

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
            {table.getAllLeafColumns().map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id.replace(/_/g, " ")}
              </DropdownMenuCheckboxItem>
            ))}
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
