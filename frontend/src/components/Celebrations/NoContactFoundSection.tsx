import { useState } from "react";
import { Box, Button, Text, Input, VStack } from "@chakra-ui/react";
import { FieldValues, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

// Zod validation schema
const schema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  surname: z
    .string()
    .min(3, { message: "Surname must be at least 3 characters." }),

  email: z
    .string()
    .min(12, { message: "Email must be at least 12 characters." })
    .max(255, { message: "Email must be no more than 255 characters." })
    .email({ message: "Must be a valid email." }),

  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message:
      "Phone number must be a valid format (e.g., +123456789 or 1234567890).",
  }),

  birthdate: z
    .string()
    .refine((date) => new Date(date) <= new Date(), {
      message: "Birthdate cannot be in the future.",
    })
    .optional(),
});

const NoContactFoundSection = ({
  onContactAdded,
}: {
  onContactAdded: () => void;
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

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
        <VStack gap={3} mt={4}>
          <Box w="100%">
            <Input placeholder="Name" {...register("name")} bg="white" />
            {errors.name && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.name.message}
              </Text>
            )}
          </Box>

          <Box w="100%">
            <Input placeholder="Surname" {...register("surname")} bg="white" />
            {errors.surname && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.surname.message}
              </Text>
            )}
          </Box>

          <Box w="100%">
            <Input placeholder="Phone" {...register("phone")} bg="white" />
            {errors.phone && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.phone.message}
              </Text>
            )}
          </Box>

          <Box w="100%">
            <Input placeholder="Email" {...register("email")} bg="white" />
            {errors.email && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.email.message}
              </Text>
            )}
          </Box>

          <Box w="100%">
            <Input type="date" {...register("birthdate")} bg="white" />
            {errors.birthdate && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.birthdate.message}
              </Text>
            )}
          </Box>

          <Button colorScheme="green" onClick={handleSubmit(onFormSubmit)}>
            Save Contact
          </Button>
        </VStack>
      ) : (
        <>
          <Text>No contacts found.</Text>
          <Button mt={2} colorScheme="blue" onClick={() => setShowForm(true)}>
            Add New Contact
          </Button>
        </>
      )}
    </Box>
  );
};

export default NoContactFoundSection;
