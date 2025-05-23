import { useMemo, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Contact } from "../../hooks/useContacts";
import useContacts from "@/hooks/useContacts";
import useUpcomingNamedays from "@/hooks/useUpcNamedaysConditionally";
import ListRow from "./ListRow";
import NamedaysPassedSection from "./NamedaysPassedSection";
import NoContactFoundSection from "./NoContactFoundSection";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  filterContactsBySearchTerm,
  findCelebrationsForEachMonth,
} from "./MemoHelpers";
import EditContact from "./EditContact";
import { ButtonConfig } from "./ContactCard";
import LoadingIndicator from "../Loading/LoadingIndicator";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

interface Props {
  isBirthday: boolean;
  searchTerm: string;
}

const CelebrationList = ({ isBirthday, searchTerm }: Props) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [buttonsError, setButtonsError] = useState("");
  const [contactBeingEdited, setContactBeingEdited] = useState<Contact | null>(
    null
  );
  const {
    contacts,
    error: contactsError,
    loading: contactsLoading,
  } = useContacts(refreshTrigger);

  const {
    upcNamedays,
    error: upcNamedaysError,
    loading: namedLoading,
  } = useUpcomingNamedays(!isBirthday);

  const currentYear = new Date().getFullYear();
  const axiosPrivate = useAxiosPrivate();

  const handleDelete = (contact: Contact) => {
    axiosPrivate
      .delete(`/api/contacts/${contact.id}`)
      .then(() => setRefreshTrigger((prev) => prev + 1))
      .catch((err) => setButtonsError(err));
  };

  const handleEdit = (contact: Contact) => {
    setContactBeingEdited(contact);
  };

  const buttons: ButtonConfig[] = [
    { label: "Edit", variant: "info", onClick: handleEdit },
    { label: "Delete Contact", variant: "danger", onClick: handleDelete },
  ];

  const filteredContacts = useMemo(
    () => filterContactsBySearchTerm(contacts, searchTerm),
    [contacts, searchTerm]
  );

  const { celebrationByMonth, namedayDateByMonth } = useMemo(
    () =>
      findCelebrationsForEachMonth(filteredContacts, isBirthday, upcNamedays),
    [filteredContacts, isBirthday, upcNamedays]
  );

  if (contactBeingEdited) {
    return (
      <EditContact
        contact={contactBeingEdited}
        onContactUpdated={() => {
          setRefreshTrigger((prev) => prev + 1);
          setContactBeingEdited(null);
        }}
      />
    );
  }

  if (contactsLoading) return <LoadingIndicator />;
  if (namedLoading && !isBirthday) return <LoadingIndicator />;

  if (contactsError || upcNamedaysError)
    return <ErrorMessage message="Failed to load data." />;

  if (buttonsError) return <ErrorMessage message="Failed to delete contact." />;

  if (filteredContacts.length === 0)
    return (
      <NoContactFoundSection
        onContactAdded={() => setRefreshTrigger((prev) => prev + 1)}
      />
    );

  if (noUpcomingCelebrations(celebrationByMonth)) {
    return isBirthday ? (
      <Text textAlign="center" fontSize="lg" color="gray.600" mt={4}>
        No upcoming birthdays found
      </Text>
    ) : (
      <NamedaysPassedSection filteredContacts={filteredContacts} />
    );
  }

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
          buttons={buttons}
        />
      ))}
    </Box>
  );
};

const noUpcomingCelebrations = (
  celebrationByMonth: Record<number, Contact[]>
) => {
  return Object.keys(celebrationByMonth).length === 0;
};

export default CelebrationList;
