import { BookUser } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardAction, CardFooter } from "@/components/ui/card";
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import ContactForm from './ContactForm';
import ContactsTable from './contactsTable/ContactsTable';
import type { FieldValues } from 'react-hook-form';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useState } from 'react';
import useContacts from '@/hooks/useContacts';
import { Spinner } from '../Spinner';
import { AlertMessage } from '../Alert'


const Contacts = () => {
    const axiosPrivate = useAxiosPrivate();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { contacts, error: contactsError, loading } = useContacts(refreshTrigger);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    const onContactAdded = () => {
        setRefreshTrigger((prev) => prev + 1);
    }

    const onFormSubmit = (data: FieldValues) => {
        const localDateString = data.birthdate.toLocaleDateString('en-CA');

        axiosPrivate
            .post("/api/contacts", {
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                birthdate: localDateString,
            })
            .then(() => {
                onContactAdded();
                setOpen(false);
            })
            .catch((err) => {
                setError(err.response.data);
            });
    };

    return (
        <Card className="w-full mx-auto shadow-xs">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <BookUser className="text-primary w-5 h-5" />
                    <CardTitle>Contacts</CardTitle>
                    {error && (
                        <div className='px-25'>
                            {error && (
                                <AlertMessage
                                    status="error"
                                    message={error}
                                    onClose={() => setError("")}
                                />
                            )}
                        </div>
                    )}
                </div>
                <CardAction>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Create Contact</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create Contacts</DialogTitle>
                                <DialogDescription>
                                    Please fill the fields below to create a new contact.
                                </DialogDescription>
                            </DialogHeader>
                            <ContactForm onFormSubmit={onFormSubmit} />
                        </DialogContent>
                    </Dialog>
                </CardAction>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Spinner />
                ) : contactsError ? (
                    <p className='text-red-500'>{contactsError}</p>
                ) : (
                    <ContactsTable onContactEdited={onContactAdded} contacts={contacts} />
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
            </CardFooter>
        </Card>
    );
};

export default Contacts;
