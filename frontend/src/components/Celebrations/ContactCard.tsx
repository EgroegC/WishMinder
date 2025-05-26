import { Box, Flex, HStack, Button, Badge, Text } from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { Contact } from "@/hooks/useContacts";

export type ButtonConfig = {
  label: string;
  variant: "danger" | "success" | "info";
  onClick: (contact: Contact) => void;
};

interface Props {
  contact: Contact;
  celebrationDate: Date | undefined;
  isBirthday: boolean;
  currentYear: number;
  buttons: ButtonConfig[];
}

const colorStyles: Record<"danger" | "success" | "info", string> = {
  danger: "red.500",
  success: "green.500",
  info: "#3182ce",
};

const ContactCard = ({
  contact,
  celebrationDate,
  isBirthday,
  currentYear,
  buttons,
}: Props) => {
  if (!celebrationDate) return null;

  const formattedDate = celebrationDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const age = isBirthday
    ? currentYear - celebrationDate.getFullYear()
    : undefined;

  return (
    <Box className="birthday-card">
      <Flex
        className="birthday-card-content"
        justify="space-between"
        align="center"
      >
        <HStack minW="250px" gap={4} align="center">
          <Box className="avatar-container">
            <FaUserCircle size="50px" color="gray" />
          </Box>
          <Text className="contact-name" color={"black"}>
            {contact.name} {contact.surname}
          </Text>
        </HStack>

        <Flex direction="column" align="center" minW="100px">
          <Text className="date-label">Date</Text>
          <Text className="date-value">{formattedDate}</Text>
        </Flex>

        {isBirthday && (
          <Flex direction="column" align="center" minW="100px" mx={10}>
            <Text className="age-label">Turns</Text>
            <Badge className="age-badge">{age} years</Badge>
          </Flex>
        )}

        <HStack gap={6}>
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              borderColor={colorStyles[btn.variant]}
              _hover={{ backgroundColor: colorStyles[btn.variant] }}
              className={`listrow_button_${idx}`}
              onClick={() => btn.onClick(contact)}
            >
              {btn.label}
            </Button>
          ))}
        </HStack>
      </Flex>
    </Box>
  );
};

export default ContactCard;
