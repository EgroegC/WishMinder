import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import ContactList from "./ContactList";
import { ButtonConfig } from "../Celebrations/ContactCard";
import useContacts, { Contact } from "@/hooks/useContacts";
import EditContact from "../Celebrations/EditContact";
import LoadingIndicator from "../Loading/LoadingIndicator";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import "./Contacts.css";
import AddContact from "./AddContact";

const Contacts = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { contacts, error, loading } = useContacts(refreshTrigger);
  const [btnError, setBtnError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [contactBeingEdited, setContactBeingEdited] = useState<Contact | null>(
    null
  );
  const axiosPrivate = useAxiosPrivate();

  const handleDelete = (contact: Contact) => {
    axiosPrivate
      .delete(`/api/contacts/${contact.id}`)
      .then(() => setRefreshTrigger((prev) => prev + 1))
      .catch((err) => setBtnError(err));
  };

  const handleEdit = (contact: Contact) => {
    setContactBeingEdited(contact);
  };

  const buttons: ButtonConfig[] = [
    { label: "Edit", variant: "info", onClick: handleEdit },
    { label: "Delete", variant: "danger", onClick: handleDelete },
  ];

  if (contactBeingEdited) {
    return (
      <Box className="contacts-container">
        <EditContact
          contact={contactBeingEdited}
          onContactUpdated={() => {
            setRefreshTrigger((prev) => prev + 1);
            setContactBeingEdited(null);
          }}
        />
      </Box>
    );
  }

  if (showForm)
    return (
      <AddContact
        onContactAdded={() => {
          setRefreshTrigger((prev) => prev + 1);
          setShowForm(false);
        }}
        onCancel={() => setShowForm(false)}
      ></AddContact>
    );

  if (btnError) return <ErrorMessage message="Failed to delete contact." />;
  if (error) return <ErrorMessage message="Failed to load Contacts." />;

  return (
    <Box className="contacts-container">
      <Flex justify="space-between" align="center" mb={3}>
        <Heading size="sm" color="gray.700">
          Contacts
        </Heading>
        <Button
          className="add-contact"
          size={"xs"}
          onClick={() => setShowForm(true)}
        >
          Add Contact
        </Button>
      </Flex>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="contacts-search-input"
      />
      {loading ? (
        <LoadingIndicator />
      ) : (
        <Box maxH="200px" overflowY="auto">
          <ContactList
            searchTerm={searchTerm}
            contacts={contacts}
            buttons={buttons}
          />
        </Box>
      )}
    </Box>
  );
};

export default Contacts;
