import { Box, Text, VStack } from "@chakra-ui/react";
import ContactCard from "./ContactCard";
import { Contact } from "../../hooks/useContacts";
import "./ListRow.css";
import { ButtonConfig } from "./ContactCard";

const ListRow = ({
  month,
  contacts,
  namedayDateByMonth,
  isBirthday,
  currentYear,
  buttons,
}: {
  month: number;
  contacts: Contact[];
  namedayDateByMonth: Record<number, Date[]>;
  isBirthday: boolean;
  currentYear: number;
  buttons: ButtonConfig[];
}) => (
  <Box className="month-container">
    <Box className="month-header">
      <Text className="month-title">
        {new Date(currentYear, month - 1).toLocaleString("default", {
          month: "long",
        })}
      </Text>
    </Box>

    <Box className="birthday-list">
      <VStack align="stretch" gap={4}>
        {contacts.map((contact, index) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            celebrationDate={
              isBirthday && contact.birthdate
                ? new Date(contact.birthdate)
                : namedayDateByMonth[month]?.[index]
            }
            isBirthday={isBirthday}
            currentYear={currentYear}
            buttons={buttons}
          />
        ))}
      </VStack>
    </Box>
  </Box>
);

export default ListRow;
