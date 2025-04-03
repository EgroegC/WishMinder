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
import useUpcommingNamedays from "@/hooks/useUpcommingNamedays";
import { Nameday } from "@/hooks/useUpcommingNamedays";
import "./BirthdayList.css";

interface Props {
  isBirthday: boolean;
}

const BirthdayList = ({ isBirthday }: Props) => {
  const { contacts, error } = useContacts();
  const { upcNamedays } = useUpcommingNamedays();

  const currentYear = new Date().getFullYear();

  let celebrationByMonth;
  let celebrationDateByMonth: Record<number, Date[]> = {};

  if (isBirthday) {
    celebrationByMonth = getBirthdaysByMonth(contacts);
  } else {
    const { namedayByMonth, namedayDateByMonth } = getUpcomingContactsNamedays(
      upcNamedays,
      contacts
    );
    celebrationByMonth = namedayByMonth;
    celebrationDateByMonth = namedayDateByMonth;
  }

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

                const celebrationDate = isBirthday
                  ? new Date(contact.birthdate)
                  : celebrationDateByMonth[parseInt(month)][
                      contacts.indexOf(contact)
                    ];

                const formattedDate =
                  celebrationDate instanceof Date
                    ? celebrationDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Invalid Date";

                const age = currentYear - celebrationDate.getFullYear();

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

const getUpcomingContactsNamedays = (
  upcNamedays: Nameday[],
  contacts: Contact[]
) => {
  try {
    const namedayMap = new Map<string, Date[]>();

    upcNamedays.forEach((nd) => {
      if (!namedayMap.has(nd.name)) {
        namedayMap.set(nd.name, []);
      }
      namedayMap.get(nd.name)?.push(new Date(nd.nameday_date));
    });

    const namedayByMonth: Record<number, Contact[]> = {};
    const namedayDateByMonth: Record<number, Date[]> = {};

    contacts.forEach((contact) => {
      if (!namedayMap.has(contact.name)) return;

      namedayMap.get(contact.name)!.forEach((date) => {
        const month = new Date(date).getMonth() + 1;

        if (!namedayByMonth[month]) {
          namedayByMonth[month] = [];
        }
        if (!namedayDateByMonth[month]) {
          namedayDateByMonth[month] = [];
        }

        namedayByMonth[month].push(contact);
        namedayDateByMonth[month].push(date);
      });
    });

    return { namedayByMonth, namedayDateByMonth };
  } catch (error) {
    console.error("❌ Error: ", error);
    throw error;
  }
};

export default BirthdayList;
