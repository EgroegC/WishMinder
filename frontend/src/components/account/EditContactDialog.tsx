import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ContactForm from "./ContactForm";
import { type Contacts } from "./contactsTable/columns";
import type { FieldValues } from "react-hook-form";

interface Props {
    open: boolean;
    contact: Contacts | null;
    onClose: () => void;
    onSubmit: (data: FieldValues) => void;
    error?: string;
    clearError: () => void;
}

const EditContactDialog = ({
    open,
    contact,
    onClose,
    onSubmit,
    error,
}: Props) => {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Contact</DialogTitle>
                    <DialogDescription>
                        Please update the contact details below.
                    </DialogDescription>
                </DialogHeader>
                {error && (
                    <p className="text-sm text-red-500 mb-2">{error}</p>
                )}
                {contact && (
                    <ContactForm
                        onFormSubmit={onSubmit}
                        defaultValues={{
                            ...contact,
                            email: contact.email ? contact.email : undefined,
                            birthdate: contact.birthdate ? contact.birthdate : undefined
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EditContactDialog;
