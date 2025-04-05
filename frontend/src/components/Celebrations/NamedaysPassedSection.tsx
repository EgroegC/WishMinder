import { Contact } from "@/hooks/useContacts";
import { Box, Text } from "@chakra-ui/react";

const NamedaysPassedSection = ({
  filteredContacts,
}: {
  filteredContacts: Contact[];
}) => (
  <Box textAlign="center" mt={4}>
    <Text color="black">
      Namedays have passed or do not exist for:{" "}
      {filteredContacts.map((contact, index) => (
        <span key={contact.id} style={{ fontWeight: "bold" }}>
          {contact.name}
          {index < filteredContacts.length - 1 && ", "}
        </span>
      ))}
    </Text>
  </Box>
);

export default NamedaysPassedSection;
