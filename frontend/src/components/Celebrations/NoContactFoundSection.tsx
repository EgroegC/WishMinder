import { useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { FieldValues } from "react-hook-form";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import "./NoContactFoundSection.css";
import ContactForm from "./ContactForm";

const NoContactFoundSection = ({
  onContactAdded,
}: {
  onContactAdded: () => void;
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const onFormSubmit = (data: FieldValues) => {
    axiosPrivate
      .post("/api/contacts", {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        birthdate: data.birthdate,
      })
      .then(() => onContactAdded())
      .catch((err) => {
        setError(err.message);
      });

    setShowForm(false);
  };

  if (error)
    return <Text color="red.500">Failed to store contact, {error}.</Text>;

  return (
    <Box textAlign="center" mt={4}>
      {showForm ? (
        <ContactForm
          onFormSubmit={onFormSubmit}
          submitButtonText="Save Contact"
        />
      ) : (
        <>
          <Text color="black" fontSize="lg" fontWeight="medium">
            No contacts found.
          </Text>
          <Button
            className="createContact-button"
            onClick={() => setShowForm(true)}
          >
            Add New Contact
          </Button>
        </>
      )}
    </Box>
  );
};

export default NoContactFoundSection;
