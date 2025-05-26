import { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { FieldValues } from "react-hook-form";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import "./AddContact.css";
import ContactForm from "./ContactForm";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const AddContact = ({
  onContactAdded,
  onCancel,
}: {
  onContactAdded: () => void;
  onCancel: () => void;
}) => {
  const axiosPrivate = useAxiosPrivate();
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
  };

  if (error)
    return <ErrorMessage message={`Failed to store contact: ${error}`} />;

  return (
    <Box className="contacts-container" mt={4}>
      <ContactForm
        onFormSubmit={onFormSubmit}
        submitButtonText="Save Contact"
      />
      <Button className="cancel-btn" onClick={() => onCancel()}>
        Cancel
      </Button>
    </Box>
  );
};

export default AddContact;
