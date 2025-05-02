import { Contact } from "@/hooks/useContacts";
import { Nameday } from "@/hooks/useUpcommingNamedays";

export const getBirthdaysByMonth = (contacts: Contact[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentYear = today.getFullYear();

  return contacts.reduce<Record<number, Contact[]>>((acc, contact) => {
    if (!contact.birthdate) return acc;

    const originalDate = new Date(contact.birthdate);
    const birthdayThisYear = new Date(
      currentYear,
      originalDate.getMonth(),
      originalDate.getDate()
    );

    if (birthdayThisYear < today) return acc;

    const birthMonth = new Date(contact.birthdate).getMonth() + 1;
    if (!acc[birthMonth]) acc[birthMonth] = [];
    acc[birthMonth].push(contact);
    return acc;
  }, {});
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
