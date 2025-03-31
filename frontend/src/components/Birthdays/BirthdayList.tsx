import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa"; // React Icon for default avatar
import useContacts from "@/hooks/useContacts";
import { Contact } from "../../hooks/useContacts";

const BirthdayList = () => {
  const { contacts, error } = useContacts();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-based

  // Group birthdays by month
  const birthdaysByMonth: Record<number, Contact[]> = {};
  contacts.forEach((contact) => {
    if (!contact.birthdate) return;

    const birthMonth = new Date(contact.birthdate).getMonth() + 1;
    if (birthMonth >= currentMonth) {
      if (!birthdaysByMonth[birthMonth]) birthdaysByMonth[birthMonth] = [];
      birthdaysByMonth[birthMonth].push(contact);
    }
  });

  if (error) return <Text color="red.500">Failed to load contacts.</Text>;

  return (
    <Box w="100%" maxW="1100px" mx="auto" p={6}>
      {" "}
      {Object.entries(birthdaysByMonth).map(([month, contacts]) => (
        <Box key={month} mb={8}>
          {/* Month Header */}
          <Box bg="blue.100" p={4} borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" color="blue.800">
              {new Date(currentYear, parseInt(month) - 1).toLocaleString(
                "default",
                {
                  month: "long",
                }
              )}
            </Text>
          </Box>

          {/* Birthday List */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <VStack align="stretch" gap={4}>
              {" "}
              {contacts.map((contact) => {
                if (!contact.birthdate) return null;

                const birthDate = new Date(contact.birthdate);
                const formattedDate = birthDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                const age = currentYear - birthDate.getFullYear();

                return (
                  <Box key={contact.id} w="100%">
                    <Flex
                      align="center"
                      justify="space-between"
                      p={5} // More padding for spacing
                      bg="white"
                      borderRadius="md"
                      boxShadow="lg"
                      transition="all 0.2s ease-in-out"
                      _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
                    >
                      {/* Avatar & Name */}
                      <HStack flex="1" minW="250px" gap={4}>
                        {" "}
                        <Box
                          boxSize="60px"
                          borderRadius="full"
                          bgGradient="linear(to-r, blue.400, cyan.400)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <FaUserCircle size="50px" color="gray" />
                        </Box>
                        <Text fontWeight="bold" fontSize="lg">
                          {" "}
                          {contact.name} {contact.surname}
                        </Text>
                      </HStack>

                      {/* Birth Date */}
                      <Flex direction="column" align="center" minW="100px">
                        <Text fontSize="sm" fontWeight="bold" color="gray.500">
                          Date
                        </Text>
                        <Text color="blue.500" fontSize="md">
                          {formattedDate}
                        </Text>
                      </Flex>

                      {/* Turns Age */}
                      <Flex
                        direction="column"
                        align="center"
                        minW="100px"
                        mx={10}
                      >
                        <Text fontSize="sm" fontWeight="bold" color="gray.500">
                          Turns
                        </Text>
                        <Badge
                          colorScheme="blue"
                          backgroundColor={"whiteAlpha.100"}
                          fontSize="md"
                          px={4}
                          py={2}
                          borderRadius="full"
                        >
                          {age} years
                        </Badge>
                      </Flex>

                      {/* Actions */}
                      <HStack gap={6}>
                        {" "}
                        <Button
                          size="md"
                          colorScheme="blue"
                          bg={"white"}
                          color={"black"}
                          _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                        >
                          Set Reminder
                        </Button>
                        <Button
                          size="md"
                          colorScheme="green"
                          bg={"white"}
                          color={"black"}
                          _hover={{ bg: "green.600", transform: "scale(1.05)" }}
                        >
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

export default BirthdayList;
