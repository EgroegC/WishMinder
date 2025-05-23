import { Contact } from "@/hooks/useContacts";
import { getBirthdaysByMonth, getUpcomingContactsNamedays } from "./Utils";
import { Nameday } from "@/hooks/useUpcNamedaysConditionally";

export function filterContactsBySearchTerm(
  contacts: Contact[],
  searchTerm: string
): Contact[] {
  return contacts.filter((contact) =>
    `${contact.name} ${contact.surname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
}

export function findCelebrationsForEachMonth(
  filteredContacts: Contact[],
  isBirthday: boolean,
  upcNamedays: Nameday[]
): {
  celebrationByMonth: Record<number, Contact[]>;
  namedayDateByMonth: Record<number, Date[]>;
} {
  if (isBirthday) {
    return {
      celebrationByMonth: getBirthdaysByMonth(filteredContacts),
      namedayDateByMonth: {},
    };
  } else {
    const { namedayByMonth, namedayDateByMonth } = getUpcomingContactsNamedays(
      upcNamedays,
      filteredContacts
    );
    return {
      celebrationByMonth: namedayByMonth,
      namedayDateByMonth,
    };
  }
}
