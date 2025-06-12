import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Contact = {
    id: string;
    name: string;
    surname: string;
    phone: string;
};

interface ContactsCardsMobileProps {
    contacts: Contact[];
    onEdit: (contact: Contact) => void;
    onDelete: (id: string) => void;
}

const ContactsCardsMobile = ({
    contacts,
    onEdit,
    onDelete,
}: ContactsCardsMobileProps) => {
    return (
        <div className="max-h-[385px] overflow-y-auto">
            {contacts.map((contact) => (
                <div
                    key={contact.id}
                    className="border rounded-lg p-4 space-y-2 shadow-sm"
                >
                    <div className="flex justify-between">
                        <span className="font-medium">Name:</span>
                        <span>
                            {contact.name} {contact.surname}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Phone:</span>
                        <span>{contact.phone}</span>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(contact)}
                        >
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => onDelete(contact.id)}
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ContactsCardsMobile;
