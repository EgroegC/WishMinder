import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { FieldValues } from "react-hook-form";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import ContactForm from "../Contacts/ContactForm";
import { Contact } from "@/hooks/useContacts";
import AlertMessage from "../Alert/AlertMessage";

const EditContact = ({
  onContactUpdated,
  contact,
}: {
  onContactUpdated: () => void;
  contact: Contact;
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState("");

  const onFormSubmit = (data: FieldValues) => {
    const updatedContactData = {
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      birthdate: data.birthdate,
    };

    axiosPrivate
      .put(`/api/contacts/${contact.id}`, updatedContactData)
      .then(() => onContactUpdated())
      .catch((err) => {
        setError(err.response.data);
      });
  };

  const contactDefaults = {
    name: contact.name || "",
    surname: contact.surname || "",
    email: contact.email || "",
    phone: contact.phone || "",
    birthdate: contact.birthdate
      ? new Date(contact.birthdate).toISOString().split("T")[0] // convert to 'yyyy-mm-dd'
      : undefined,
  };

  return (
    <Box textAlign="center" mt={4}>
      {error && (
        <AlertMessage
          status="error"
          message={`Failed to edit contact, ${error}`}
        />
      )}
      <ContactForm
        onFormSubmit={onFormSubmit}
        submitButtonText="Edit Contact"
        defaultValues={contactDefaults}
      />
    </Box>
  );
};

export default EditContact;
