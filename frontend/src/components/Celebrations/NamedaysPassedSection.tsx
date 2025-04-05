import { Contact } from "@/hooks/useContacts";
import { Box, Text } from "@chakra-ui/react";

const NamedaysPassedSection = ({
  filteredContacts,
}: {
  filteredContacts: Contact[];
}) => (
  <Box textAlign="center" mt={4}>
    <Text>
      Namedays have passed for:{" "}
      {filteredContacts.map((contact) => contact.name).join(", ")}
    </Text>
  </Box>
);

export default NamedaysPassedSection;
