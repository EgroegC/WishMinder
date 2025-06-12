// columns.ts
import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";

export type Contacts = {
    id: string;
    name: string;
    surname: string;
    phone: string;
    email?: string;
    birthdate?: string;
};

export const getColumns = (
    handleEdit: (contact: Contacts) => void,
    handleDelete: (id: string) => void
): ColumnDef<Contacts>[] => [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ getValue }) => <div className="text-center">{getValue() as string}</div>,
        },
        {
            accessorKey: "surname",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Surname
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="lowercase">{row.getValue("surname")}</div>
            ),
            filterFn: (row, columnId, filterValue) => {
                const value = row.getValue(columnId);
                return typeof value === "string" &&
                    value.toLowerCase().includes(filterValue.toLowerCase());
            },
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ getValue }) => <div className="text-center">{getValue() as string}</div>,
        },
        {
            id: "actions",
            header: () => (
                <div className="text-center font-semibold">
                    Actions
                </div>
            ),
            cell: ({ row }) => {
                const contact = row.original;

                return (
                    <div className="flex justify-center items-center gap-5">
                        <Button
                            size="sm"
                            variant="outline"
                            className="px-5"
                            onClick={() => handleEdit(contact)}
                        >
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            className="px-5 text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDelete(contact.id)}
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                        </Button>
                    </div>
                );
            },
        },
    ];
