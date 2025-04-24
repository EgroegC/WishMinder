import { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { FieldValues } from "react-hook-form";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import "./NoContactFoundSection.css";
import ContactForm from "./ContactForm";
import { Contact } from "@/hooks/useContacts";

const NoContactFoundSection = ({
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
        setError(err.message);
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

  if (error)
    return <Text color="red.500">Failed to edit contact, {error}.</Text>;

  return (
    <Box textAlign="center" mt={4}>
      <ContactForm
        onFormSubmit={onFormSubmit}
        submitButtonText="Edit Contact"
        defaultValues={contactDefaults}
      />
    </Box>
  );
};

export default NoContactFoundSection;
