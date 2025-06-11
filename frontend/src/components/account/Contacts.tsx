import { BookUser } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardAction, CardFooter } from "@/components/ui/card";
import { Button } from '../ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ContactsTable from './contactsTable/contactsTable';

const Notifications = () => {

    return (
        <Card className="w-full mx-auto shadow-xs">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <BookUser className="text-primary w-5 h-5" />
                    <CardTitle>Contacts</CardTitle>
                </div>
                <CardAction>
                    <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <Button variant="outline">Create Contact</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create Contacts</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name-1">Name</Label>
                                        <Input id="name-1" name="name" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="surname-1">Surname</Label>
                                        <Input id="surname-1" name="surname" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="email-1">email</Label>
                                        <Input id="email-1" name="email" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="birthdate-1">Birthdate</Label>
                                        <Input id="birthdate-1" name="birthdate" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>
                </CardAction>
            </CardHeader>
            <CardContent>
                <ContactsTable />
            </CardContent>
            <CardFooter className="flex-col gap-2">
            </CardFooter>
        </Card>

    );
};

export default Notifications;
