import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import useContacts from "@/hooks/useContacts";
import { Contact } from "../../hooks/useContacts";
import "./BirthdayList.css";

interface Props {
  isBirthday: boolean;
}

const BirthdayList = ({ isBirthday }: Props) => {
  const { contacts, error } = useContacts();
  const currentYear = new Date().getFullYear();

  const celebrationByMonth = getBirthdaysByMonth(contacts);

  if (error) return <Text color="red.500">Failed to load contacts.</Text>;

  return (
    <Box className="birthday-list-container">
      {Object.entries(celebrationByMonth).map(([month, contacts]) => (
        <Box key={month} className="month-container">
          {/* Month Header */}
          <Box className="month-header">
            <Text className="month-title">
              {new Date(currentYear, parseInt(month) - 1).toLocaleString(
                "default",
                {
                  month: "long",
                }
              )}
            </Text>
          </Box>

          {/* Birthday List */}
          <Box className="birthday-list">
            <VStack align="stretch" gap={4}>
              {contacts.map((contact) => {
                if (!contact.birthdate) return null;

                const birthDate = new Date(contact.birthdate);
                const formattedDate = birthDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                const age = currentYear - birthDate.getFullYear();

                return (
                  <Box key={contact.id} className="birthday-card">
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

                      {/* Birth Date */}
                      <Flex direction="column" align="center" minW="100px">
                        <Text className="date-label">Date</Text>
                        <Text className="date-value">{formattedDate}</Text>
                      </Flex>

                      {/* Turns Age */}
                      {isBirthday && (
                        <Flex
                          direction="column"
                          align="center"
                          minW="100px"
                          mx={10}
                        >
                          <Text className="age-label">Turns</Text>
                          <Badge className="age-badge">{age} years</Badge>
                        </Flex>
                      )}

                      {/* Actions */}
                      <HStack gap={6}>
                        <Button className="reminder-button">
                          Set Reminder
                        </Button>
                        <Button className="auto-message-button">
                          Auto Message
                        </Button>
                      </HStack>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const getBirthdaysByMonth = (contacts: Contact[]) => {
  const currentMonth = new Date().getMonth() + 1; // 1-based

  const birthdaysByMonth: Record<number, Contact[]> = {};
  contacts.forEach((contact) => {
    if (!contact.birthdate) return;

    const birthMonth = new Date(contact.birthdate).getMonth() + 1;
    if (birthMonth >= currentMonth) {
      if (!birthdaysByMonth[birthMonth]) birthdaysByMonth[birthMonth] = [];
      birthdaysByMonth[birthMonth].push(contact);
    }
  });

  return birthdaysByMonth;
};

export default BirthdayList;
