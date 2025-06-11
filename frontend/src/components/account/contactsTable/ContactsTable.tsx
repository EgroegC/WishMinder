import { type Contacts, getColumns } from './columns';
import { DataTable } from "./data-table";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useState } from "react";
import ContactsCardsMobile from "./ContactCardMobile";

const ContactsTable = ({
    onContactAdded,
    contacts,
}: {
    onContactAdded: () => void;
    contacts: Contacts[];
}) => {
    const axiosPrivate = useAxiosPrivate();
    const [btnError, setBtnError] = useState("");

    const handleEdit = (id: string) => {
        console.log("Edit", id);
    };
    const handleDelete = (id: string) => {
        axiosPrivate
            .delete(`/api/contacts/${id}`)
            .then(() => onContactAdded())
            .catch((err) => setBtnError(err));
    };

    return (
        <div className="">
            {btnError ? (
                <p>Failed to delete contact.</p>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
};

export default ContactsTable;
