import { Contact } from "@/hooks/useContacts";
import { Nameday } from "@/hooks/useUpcommingNamedays";

export const getBirthdaysByMonth = (contacts: Contact[]) => {
  const contactsByBirthdayMonth = getContactsByBirthdayMonth(contacts);

  return sortContactsByBirthdayMonth(contactsByBirthdayMonth);
};

export const getUpcomingContactsNamedays = (
  upcNamedays: Nameday[],
  contacts: Contact[]
) => {
  const namedayMap = new Map<string, Date[]>();

  upcNamedays.forEach((nd) => {
    if (!namedayMap.has(nd.name)) {
      namedayMap.set(nd.name, []);
    }
    namedayMap.get(nd.name)?.push(new Date(nd.nameday_date));
  });

  const namedayByMonth: Record<number, Contact[]> = {};
  const namedayDateByMonth: Record<number, Date[]> = {};

  contacts.forEach((contact) => {
    if (!namedayMap.has(contact.name)) return;

    namedayMap.get(contact.name)!.forEach((date) => {
      const month = date.getMonth() + 1;
      if (!namedayByMonth[month]) namedayByMonth[month] = [];
      if (!namedayDateByMonth[month]) namedayDateByMonth[month] = [];

      namedayByMonth[month].push(contact);
      namedayDateByMonth[month].push(date);
    });
  });

  return { namedayByMonth, namedayDateByMonth };
};

const getContactsByBirthdayMonth = (contacts: Contact[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentYear = today.getFullYear();

  const grouped: Record<number, Contact[]> = {};

  for (const contact of contacts) {
    if (!contact.birthdate) continue;

    const originalDate = new Date(contact.birthdate);
    const birthdayThisYear = new Date(
      currentYear,
      originalDate.getMonth(),
      originalDate.getDate()
    );

    if (birthdayThisYear < today) continue;

    const birthMonth = originalDate.getMonth() + 1;

    if (!grouped[birthMonth]) grouped[birthMonth] = [];
    grouped[birthMonth].push(contact);
  }

  return grouped;
};

const sortContactsByBirthdayMonth = (
  contactsByMonth: Record<number, Contact[]>
) => {
  for (const month in contactsByMonth) {
    contactsByMonth[month].sort((a, b) => {
      if (!a.birthdate || !b.birthdate) return 0;
      const aDate = new Date(a.birthdate);
      const bDate = new Date(b.birthdate);
      return aDate.getDate() - bDate.getDate();
    });
  }

  return contactsByMonth;
};
