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
    <Box className="birthday-card" w="100%">
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify={{ base: "center", md: "space-between" }}
        wrap="wrap"
        gap={{ base: 4, md: 0 }}
      >
        {/* Left: Avatar + Name */}
        <HStack minW="200px" gap={4} flexShrink={0}>
          <Box className="avatar-container">
            <FaUserCircle size="50px" color="gray" />
          </Box>
          <Text className="contact-name" color="black">
            {contact.name} {contact.surname}
          </Text>
        </HStack>

        {/* Center: Date & Turns */}
        <Flex
          align="center"
          justify="center"
          flexGrow={1}
          gap={10}
          mt={{ base: 2, md: 0 }}
        >
          <Flex direction="column" align="center" minW="80px">
            <Text className="date-label">Date</Text>
            <Text className="date-value">{formattedDate}</Text>
          </Flex>

          {isBirthday && (
            <Flex direction="column" align="center" minW="80px">
              <Text className="age-label">Turns</Text>
              <Badge className="age-badge">{age} years</Badge>
            </Flex>
          )}
        </Flex>

        {/* Right: Buttons */}
        <HStack gap={3} mt={{ base: 4, md: 0 }}>
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              size="sm"
              borderColor={colorStyles[btn.variant]}
              _hover={{
                backgroundColor: colorStyles[btn.variant],
                color: "white",
              }}
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
