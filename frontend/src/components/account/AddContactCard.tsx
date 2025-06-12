import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUp } from 'lucide-react';
import { useRef, useState } from "react";

interface Duplicates {
    name: string;
    surname: string;
}

interface PartialContact {
    name?: string;
    surname?: string;
    phone: string;
    email?: string;
    birthdate?: Date;
}

const AddContactCard = ({
    onContactAdded,
}: {
    onContactAdded: (mess?: string) => void;
}) => {
    const axiosPrivate = useAxiosPrivate();
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleVcfUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleVcfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            setError("No file selected. Please choose a contact card (.vcf) file.");
            return;
        }

        const text = await file.text();
        const contacts = parseVcfToContacts(text);

        if (!contacts || contacts.length === 0) {
            setError("The uploaded file does not contain any valid contacts.");
            return;
        }

        axiosPrivate
            .post("/api/contacts/batch", {
                contacts,
            })
            .then((res) => {
                const updatedContacts = (res.data.updated as Duplicates[])
                    .map((c) => [c.name, c.surname].filter(Boolean).join(" "))
                    .join(", ");

                onContactAdded(
                    `${res.data.insertedCount} new contacts imported, ${res.data.updatedCount} replaced: ${updatedContacts}`
                );
            })
            .catch((err) => {
                setError(err.request.response);
            });
    };

    return (
        <>
            <Button
                variant="ghost"
                onClick={handleVcfUploadClick}
                className="text-gray-700 font-medium mx-auto block hover:underline active:bg-gray-200"
            >
                <div className="flex items-center gap-2">
                    <FileUp className="w-5 h-5" />
                    <span>Upload Contact Card (.vcf)</span>
                </div>
            </Button>

            {error && (
                <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to store contacts: {error}
                    </AlertDescription>
                </Alert>
            )}

            <input
                type="file"
                ref={fileInputRef}
                accept=".vcf"
                onChange={handleVcfUpload}
                style={{ display: "none" }}
            />
        </>
    );
};

const parseVcfToContacts = (vcfText: string): PartialContact[] => {
    const contacts: PartialContact[] = [];
    const cards = vcfText.split("BEGIN:VCARD").slice(1);

    for (const card of cards) {
        let name: string | undefined;
        let surname: string | undefined;
        let phone: string | undefined;
        let email: string | undefined;
        let birthdate: Date | undefined;

        const lines = card.split("\n").map((line) => line.trim());

        for (const line of lines) {
            if (line.startsWith("FN:") && !name && !surname) {
                const fullName = line.replace("FN:", "").trim();
                const parts = fullName.split(" ");
                if (parts.length > 0 && parts[0]) name = parts[0];
                if (parts.length > 1) surname = parts.slice(1).join(" ").trim() || undefined;
            }

            if (line.startsWith("N:") && !name && !surname) {
                const parts = line.replace("N:", "").split(";");
                if (parts[0]) surname = parts[0].trim() || undefined;
                if (parts[1]) name = parts[1].trim() || undefined;
            }

            if (line.startsWith("TEL") && !phone) {
                const telParts = line.split(":");
                if (telParts[1]) phone = telParts[1].trim() || undefined;
            }

            if (line.startsWith("EMAIL:") && !email) {
                email = line.replace("EMAIL:", "").trim() || undefined;
            }

            if (line.startsWith("BDAY:")) {
                const rawDate = line.replace("BDAY:", "").trim();
                const parsedDate = new Date(rawDate);
                if (!isNaN(parsedDate.getTime())) {
                    birthdate = parsedDate;
                }
            }
        }

        if ((name || surname) && phone) {
            contacts.push({
                name,
                surname,
                phone,
                email,
                birthdate,
            });
        }
    }

    return contacts;
};

export default AddContactCard;
