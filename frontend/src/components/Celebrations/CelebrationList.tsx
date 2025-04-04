import { useMemo } from "react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { Contact } from "../../hooks/useContacts";
import useContacts from "@/hooks/useContacts";
import useUpcommingNamedays from "@/hooks/useUpcommingNamedays";
import {
  getBirthdaysByMonth,
  getUpcomingContactsNamedays,
} from "./CelebrationUtils";
import ContactCard from "./ContactCard";
import "./CelebrationList.css";

interface Props {
  isBirthday: boolean;
  searchTerm: string;
}

const CelebrationList = ({ isBirthday, searchTerm }: Props) => {
  const { contacts, error: contactsError } = useContacts();
  const { upcNamedays, error: upcNamedaysError } = useUpcommingNamedays();
  const currentYear = new Date().getFullYear();

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      `${contact.name} ${contact.surname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [contacts, searchTerm]);

  // Memoize calculations to prevent unnecessary recomputations
  const { celebrationByMonth, celebrationDateByMonth } = useMemo(() => {
    if (isBirthday) {
      return {
        celebrationByMonth: getBirthdaysByMonth(filteredContacts),
        celebrationDateByMonth: {} as Record<number, Date[]>,
      };
    } else {
      const { namedayByMonth, namedayDateByMonth } =
        getUpcomingContactsNamedays(upcNamedays, filteredContacts);
      return {
        celebrationByMonth: namedayByMonth,
        celebrationDateByMonth: namedayDateByMonth,
      };
    }
  }, [filteredContacts, upcNamedays, isBirthday]);

  if (contactsError || upcNamedaysError)
    return <Text color="red.500">Failed to load data.</Text>;

  if (filteredContacts.length > 0) {
    if (Object.keys(celebrationByMonth).length === 0) {
      return (
        <Box textAlign="center" mt={4}>
          <Text>
            Namedays have passed for:{" "}
            {filteredContacts.map((contact) => contact.name).join(", ")}
          </Text>
        </Box>
      );
    }
    return (
      <Box className="birthday-list-container">
        {Object.entries(celebrationByMonth).map(([month, contacts]) => (
          <MonthSection
            key={month}
            month={parseInt(month)}
            contacts={contacts}
            celebrationDateByMonth={celebrationDateByMonth}
            isBirthday={isBirthday}
            currentYear={currentYear}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box textAlign="center" mt={4}>
      <Text>No contacts found.</Text>
      <Button mt={2} colorScheme="blue">
        Add New Contact
      </Button>
    </Box>
  );
};

const MonthSection = ({
  month,
  contacts,
  celebrationDateByMonth,
  isBirthday,
  currentYear,
}: {
  month: number;
  contacts: Contact[];
  celebrationDateByMonth: Record<number, Date[]>;
  isBirthday: boolean;
  currentYear: number;
}) => (
  <Box className="month-container">
    <Box className="month-header">
      <Text className="month-title">
        {new Date(currentYear, month - 1).toLocaleString("default", {
          month: "long",
        })}
      </Text>
    </Box>

    <Box className="birthday-list">
      <VStack align="stretch" gap={4}>
        {contacts.map((contact, index) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            celebrationDate={
              isBirthday && contact.birthdate
                ? new Date(contact.birthdate)
                : celebrationDateByMonth[month]?.[index]
            }
            isBirthday={isBirthday}
            currentYear={currentYear}
          />
        ))}
      </VStack>
    </Box>
  </Box>
);

export default CelebrationList;
