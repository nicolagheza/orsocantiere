'use client';

import { Tables } from '@/utils/supabase/database.types';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  VisibilityState,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation'
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
import Link from 'next/link';

type Cliente = Tables<'clienti'>;

interface ClientiTableProps {
  data: Cliente[];
}

const ClientiTable: React.FC<ClientiTableProps> = ({ data }) => {
  const router = useRouter();

  const clienteKeys = Object.keys(data[0] || {}) as Array<keyof Cliente>;
  const columnHelper = createColumnHelper<Cliente>();

  const columns = useMemo(() => {
    return clienteKeys.map((key) =>
      columnHelper.accessor(key, {
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        cell: info => info.getValue()?.toString() || '-'
      })
    );
  }, []);

  const defaultVisibility = clienteKeys.reduce((acc, key) => ({
    ...acc,
    [key]: false
  }), {});


  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    ...defaultVisibility,
    denominazione: true,
    partita_iva: true,
    email: true,
    telefono: true,
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
        <Link href={"/clienti/new"}><Button>Nuovo cliente</Button></Link>
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
            {table.getAllLeafColumns().map(column => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id.replace(/_/g, ' ')}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-900"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/clienti/${row.original.id}`)}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm text-gray-500"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
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

export default ClientiTable;
