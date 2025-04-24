import { Box, Flex, HStack, Button, Badge, Text } from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { Contact } from "@/hooks/useContacts";

export type ButtonConfig = {
  label: string;
  onClick: (contact: Contact) => void;
};

interface Props {
  contact: Contact;
  celebrationDate: Date | undefined;
  isBirthday: boolean;
  currentYear: number;
  buttons: ButtonConfig[];
}

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
      <Flex className="birthday-card-content">
        {/* Avatar & Name */}
        <HStack flex="1" minW="250px" gap={4}>
          <Box className="avatar-container">
            <FaUserCircle size="50px" color="gray" />
          </Box>
          <Text className="contact-name" color={"black"}>
            {contact.name} {contact.surname}
          </Text>
        </HStack>

        {/* Date */}
        <Flex direction="column" align="center" minW="100px">
          <Text className="date-label">Date</Text>
          <Text className="date-value">{formattedDate}</Text>
        </Flex>

        {/* Age (Only for birthdays) */}
        {isBirthday && (
          <Flex direction="column" align="center" minW="100px" mx={10}>
            <Text className="age-label">Turns</Text>
            <Badge className="age-badge">{age} years</Badge>
          </Flex>
        )}

        {/* Actions */}
        <HStack gap={6}>
          <Button
            className="listrow_first_button"
            onClick={() => buttons[0].onClick(contact)}
          >
            {buttons[0].label}
          </Button>

          <Button
            className="listrow_second_button"
            onClick={() => buttons[1].onClick(contact)}
          >
            {buttons[1].label}
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default ContactCard;
