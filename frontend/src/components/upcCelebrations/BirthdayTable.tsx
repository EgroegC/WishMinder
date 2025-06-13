import { type Contacts } from "../account/contactsTable/columns";
import CelebrationList from "./CelebrationList";

type BirthdayContact = {
    id: string;
    name: string;
    surname: string;
    birthdate: string;
};

const filterContactsWithBirthdates = (contacts: Contacts[]): BirthdayContact[] =>
    contacts
        .filter((c) => c.birthdate)
        .map(({ id, name, surname, birthdate }) => ({
            id,
            name,
            surname,
            birthdate: birthdate!,
        }));

const getContactsByBirthdayMonth = (contacts: BirthdayContact[]) => {
    const today = new Date();
    const currentYear = today.getFullYear();

    const grouped: Record<number, BirthdayContact[]> = {};

    contacts.forEach((contact) => {
        const birth = new Date(contact.birthdate);
        const birthMonth = birth.getMonth(); // 0-indexed
        const birthdayThisYear = new Date(currentYear, birthMonth, birth.getDate());

        if (birthdayThisYear < today) return;

        if (!grouped[birthMonth]) grouped[birthMonth] = [];
        grouped[birthMonth].push(contact);
    });

    return grouped;
};

const sortContactsByBirthdayMonth = (grouped: Record<number, BirthdayContact[]>) => {
    Object.values(grouped).forEach((group) =>
        group.sort(
            (a, b) =>
                new Date(a.birthdate).getDate() - new Date(b.birthdate).getDate()
        )
    );
    return grouped;
};

export default function BirthdayTable({ contacts }: { contacts: Contacts[] }) {
    const filtered = filterContactsWithBirthdates(contacts);
    const grouped = getContactsByBirthdayMonth(filtered);
    const sortedGrouped = sortContactsByBirthdayMonth(grouped);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <CelebrationList contactsByMonth={sortedGrouped} isBirthday={true} />
        </div>
    );
}
