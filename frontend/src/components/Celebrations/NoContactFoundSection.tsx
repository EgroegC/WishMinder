import { Box, Button, Text } from "@chakra-ui/react";

const NoContactFoundSection = () => (
  <Box textAlign="center" mt={4}>
    <Text>No contacts found.</Text>
    <Button mt={2} colorScheme="blue">
      Add New Contact
    </Button>
  </Box>
);

export default NoContactFoundSection;
