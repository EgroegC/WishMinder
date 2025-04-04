import { Box, Flex, HStack, Button, Badge, Text } from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { Contact } from "@/hooks/useContacts";

interface Props {
  contact: Contact;
  celebrationDate: Date | undefined;
  isBirthday: boolean;
  currentYear: number;
}

const ContactCard = ({
  contact,
  celebrationDate,
  isBirthday,
  currentYear,
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
          <Button className="reminder-button">Set Reminder</Button>
          <Button className="auto-message-button">Auto Message</Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default ContactCard;
