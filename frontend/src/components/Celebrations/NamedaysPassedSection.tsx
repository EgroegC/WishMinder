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
      {[...new Set(filteredContacts.map((contact) => contact.name))].map(
        (name, index, arr) => (
          <span key={name} style={{ fontWeight: "bold" }}>
            {name}
            {index < arr.length - 1 && ", "}
          </span>
        )
      )}
    </Text>
  </Box>
);

export default NamedaysPassedSection;
