import { Box, Button, Text, Input, VStack } from "@chakra-ui/react";
import { FieldValues, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

interface Props {
  onFormSubmit: (data: FieldValues) => void;
  submitButtonText: string;
  defaultValues?: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthdate?: string;
  };
}

const ContactForm = ({
  onFormSubmit,
  submitButtonText,
  defaultValues,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues });

  return (
    <VStack gap={3} mt={4}>
      <Box w="100%">
        <Input
          placeholder="Name"
          {...register("name")}
          className="custom-input"
        />
        {errors.name && (
          <Text color="red.500" fontSize="sm" mt={1}>
            {errors.name.message}
          </Text>
        )}
      </Box>

      <Box w="100%">
        <Input
          placeholder="Surname"
          {...register("surname")}
          className="custom-input"
        />
        {errors.surname && (
          <Text color="red.500" fontSize="sm" mt={1}>
            {errors.surname.message}
          </Text>
        )}
      </Box>

      <Box w="100%">
        <Input
          placeholder="Phone"
          {...register("phone")}
          className="custom-input"
        />
        {errors.phone && (
          <Text color="red.500" fontSize="sm" mt={1}>
            {errors.phone.message}
          </Text>
        )}
      </Box>

      <Box w="100%">
        <Input
          placeholder="Email"
          {...register("email")}
          className="custom-input"
        />
        {errors.email && (
          <Text color="red.500" fontSize="sm" mt={1}>
            {errors.email.message}
          </Text>
        )}
      </Box>

      <Box w="100%">
        <Input
          type="date"
          {...register("birthdate")}
          className="custom-input"
        />
        {errors.birthdate && (
          <Text color="red.500" fontSize="sm" mt={1}>
            {errors.birthdate.message}
          </Text>
        )}
      </Box>

      <Button className="save-button" onClick={handleSubmit(onFormSubmit)}>
        {submitButtonText}
      </Button>
    </VStack>
  );
};

export default ContactForm;
