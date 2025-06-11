import useContacts from "@/hooks/useContacts";
import { getColumns } from './columns';
import { DataTable } from "./data-table";
import { Spinner } from "@/components/Spinner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useState } from "react";
import ContactsCardsMobile from "./ContactCardMobile";

const ContactsTable = () => {
    const axiosPrivate = useAxiosPrivate();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { contacts, error, loading } = useContacts(refreshTrigger);
    const [btnError, setBtnError] = useState("");

    const handleEdit = (id: string) => {
        console.log("Edit", id);
    };
    const handleDelete = (id: string) => {
        axiosPrivate
            .delete(`/api/contacts/${id}`)
            .then(() => setRefreshTrigger((prev) => prev + 1))
            .catch((err) => setBtnError(err));
    };

    return (
        <div className="">
            {loading ? (
                <Spinner />
            ) : error ? (
                <p>Failed to load contacts.</p>
            ) : btnError ? (
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
