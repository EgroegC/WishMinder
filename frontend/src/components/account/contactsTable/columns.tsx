// columns.ts
import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

export type Contacts = {
    id: string;
    name: string;
    surname: string;
    phone: string;
};

export const getColumns = (
    handleEdit: (id: string) => void,
    handleDelete: (id: string) => void
): ColumnDef<Contacts>[] => [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ getValue }) => <div className="text-center">{getValue() as string}</div>,
        },
        {
            accessorKey: "surname",
            header: "Surname",
            cell: ({ getValue }) => <div className="text-center">{getValue() as string}</div>,
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
                            onClick={() => handleEdit(contact.id)}
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
