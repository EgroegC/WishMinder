import { type Contacts, getColumns } from './columns';
import { DataTable } from "./data-table";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useState } from "react";
import ContactsCardsMobile from "./ContactCardMobile";
import EditContactDialog from "../EditContactDialog";
import { AlertMessage } from '@/components/Alert';
import type { FieldValues } from 'react-hook-form';

const ContactsTable = ({
    onContactEdited,
    contacts,
}: {
    onContactEdited: () => void;
    contacts: Contacts[];
}) => {
    const axiosPrivate = useAxiosPrivate();
    const [btnError, setBtnError] = useState("");
    const [editError, seteditError] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contacts | null>(null);

    const handleEdit = (contact: Contacts) => {
        setSelectedContact(contact);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedContact(null);
        seteditError("");
    };

    const onEditFormSubmit = (data: FieldValues) => {
        if (!selectedContact) {
            seteditError("No contact selected.");
            return;
        }

        if (data.birthdate) {
            const localIsoDate = data.birthdate.toLocaleDateString('en-CA');
            data = { ...data, birthdate: localIsoDate, }
        }


        axiosPrivate
            .put(`/api/contacts/${selectedContact.id}`, data)
            .then(() => {
                onContactEdited();
                handleCloseDialog();
            })
            .catch((err) => {
                seteditError(err.response?.data || "An error occurred.");
            });
    };

    const handleDelete = (id: string) => {
        axiosPrivate
            .delete(`/api/contacts/${id}`)
            .then(() => onContactEdited())
            .catch(() => setBtnError("Failed to delete contact."));
    };

    return (
        <div>
            {btnError && (
                <AlertMessage status="error" message={btnError} onClose={() => setBtnError("")} />
            )}

            <EditContactDialog
                open={open}
                contact={selectedContact}
                onClose={handleCloseDialog}
                onSubmit={onEditFormSubmit}
                error={editError}
                clearError={() => seteditError("")}
            />

            <div className="hidden md:block">
                <DataTable columns={getColumns(handleEdit, handleDelete)} data={contacts} />
            </div>
            <div className="md:hidden space-y-4">
                <ContactsCardsMobile
                    contacts={contacts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default ContactsTable;
