import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type Row,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import type { Contacts } from "./columns"

interface DataTableProps {
    columns: ColumnDef<Contacts, unknown>[]
    data: Contacts[]
}

function nameOrSurnameFilter(row: Row<Contacts>, _columnId: string, filterValue: string) {
    const name = row.original.name?.toLowerCase() ?? ""
    const surname = row.original.surname?.toLowerCase() ?? ""
    const value = filterValue.toLowerCase()

    return name.includes(value) || surname.includes(value)
}

export function DataTable({ columns, data }: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState("")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: nameOrSurnameFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
    });

    return (
        <>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter by name or surname..."
                    value={globalFilter}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-md border w-full overflow-x-auto">
                <div className="max-h-[340px] overflow-y-auto min-w-full">
                    <Table className="min-w-full table-auto">
                        <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="text-center">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="text-center max-w-[200px] truncate whitespace-nowrap overflow-hidden"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center h-24">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}
