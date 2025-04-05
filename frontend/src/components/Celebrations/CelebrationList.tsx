import { useMemo, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Contact } from "../../hooks/useContacts";
import useContacts from "@/hooks/useContacts";
import useUpcommingNamedays from "@/hooks/useUpcommingNamedays";
import ListRow from "./ListRow";
import NamedaysPassedSection from "./NamedaysPassedSection";
import NoContactFoundSection from "./NoContactFoundSection";
import {
  filterContactsBySearchTerm,
  findCelebrationsForEachMonth,
} from "./MemoHelpers";

interface Props {
  isBirthday: boolean;
  searchTerm: string;
}

const CelebrationList = ({ isBirthday, searchTerm }: Props) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { contacts, error: contactsError } = useContacts(refreshTrigger);
  const { upcNamedays, error: upcNamedaysError } = useUpcommingNamedays();
  const currentYear = new Date().getFullYear();

  const filteredContacts = useMemo(
    () => filterContactsBySearchTerm(contacts, searchTerm),
    [contacts, searchTerm]
  );

  const { celebrationByMonth, namedayDateByMonth } = useMemo(
    () =>
      findCelebrationsForEachMonth(filteredContacts, isBirthday, upcNamedays),
    [filteredContacts, isBirthday, upcNamedays]
  );

  if (contactsError || upcNamedaysError)
    return <Text color="red.500">Failed to load data.</Text>;

  if (filteredContacts.length === 0)
    return (
      <NoContactFoundSection
        onContactAdded={() => setRefreshTrigger((prev) => prev + 1)}
      />
    );

  if (theContactsNamedaysPassedForFilteredContacts(celebrationByMonth))
    return <NamedaysPassedSection filteredContacts={filteredContacts} />;

  return (
    <Box className="birthday-list-container">
      {Object.entries(celebrationByMonth).map(([month, contacts]) => (
        <ListRow
          key={month}
          month={parseInt(month)}
          contacts={contacts}
          namedayDateByMonth={namedayDateByMonth}
          isBirthday={isBirthday}
          currentYear={currentYear}
        />
      ))}
    </Box>
  );
};

const theContactsNamedaysPassedForFilteredContacts = (
  celebrationByMonth: Record<number, Contact[]>
) => {
  return Object.keys(celebrationByMonth).length === 0;
};

export default CelebrationList;
