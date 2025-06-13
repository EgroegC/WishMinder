import { type Contacts } from "../account/contactsTable/columns";
import CelebrationList from "./CelebrationList";
import { parseISO } from "date-fns";

type Nameday = {
    name: string;
    nameday_date: string;
};

type NamedayContact = {
    id: string;
    name: string;
    surname: string;
    nameday_date: string;
};

const filterContactsWithNamedays = (
    contacts: Contacts[],
    namedays: Nameday[]
): NamedayContact[] => {
    const namedayMap = new Map(
        namedays
            .filter((n) => n.name?.trim())
            .map((n) => [n.name.toLowerCase(), n.nameday_date])
    );

    return contacts
        .filter((c) => c.name?.trim() && namedayMap.has(c.name.toLowerCase()))
        .map((c) => ({
            id: c.id,
            name: c.name,
            surname: c.surname,
            nameday_date: namedayMap.get(c.name.toLowerCase())!,
        }));
};

const groupContactsByNamedayMonth = (
    contacts: NamedayContact[]
): Record<number, NamedayContact[]> => {
    const grouped: Record<number, NamedayContact[]> = {};

    for (const contact of contacts) {
        const date = parseISO(contact.nameday_date);
        const month = date.getMonth();

        if (!grouped[month]) grouped[month] = [];
        grouped[month].push(contact);
    }

    return grouped;
};

const sortGroupedContacts = (
    grouped: Record<number, NamedayContact[]>
): Record<number, NamedayContact[]> => {
    Object.values(grouped).forEach((group) =>
        group.sort(
            (a, b) =>
                parseISO(a.nameday_date).getDate() -
                parseISO(b.nameday_date).getDate()
        )
    );
    return grouped;
};

export default function NamedayTable({
    contacts,
    namedays,
}: {
    contacts: Contacts[];
    namedays: Nameday[];
}) {
    const matched = filterContactsWithNamedays(contacts, namedays);
    const grouped = groupContactsByNamedayMonth(matched);
    const sortedGrouped = sortGroupedContacts(grouped);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <CelebrationList contactsByMonth={sortedGrouped} isBirthday={false} />
        </div>
    );
}
