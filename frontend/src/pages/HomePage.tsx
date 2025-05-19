import {
  Box,
  Text,
  Heading,
  Flex,
  Grid,
  GridItem,
  LinkBox,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaBirthdayCake, FaCalendarAlt, FaQuoteLeft } from "react-icons/fa";
import NavBar from "../components/NavBar/NavBar";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const HomePage = () => {
  const axiosPrivate = useAxiosPrivate();
  usePushNotifications(axiosPrivate);

  const navigate = useNavigate();

  return (
    <Grid
      templateAreas={`"nav"
                      "main"`}
      gridTemplateRows={"60px 1fr"}
      gridTemplateColumns={"1fr"}
      minH="100vh"
      bg="gray.50"
    >
      {/* NavBar Section */}
      <GridItem area="nav" p={-1} bg="white" boxShadow="sm">
        <NavBar />
      </GridItem>

      {/* Main Content Section */}
      <GridItem area="main">
        <Box p={8} display="flex" flexDirection="column" alignItems="center">
          {/* Hero Section */}
          <Box textAlign="center" mb={8}>
            <Heading size="2xl" color="blue.600">
              🎉 Welcome to the Celebration Hub!
            </Heading>
            <Text fontSize="lg" color="gray.700" mt={2}>
              Stay connected with friends & family. Never miss a special day!
            </Text>
          </Box>

          {/* Links Section */}
          <Flex gap={8} mb={10} flexWrap="wrap" justify="center">
            {/* Birthdays Link */}
            <LinkBox
              onClick={() => navigate("/birthdays")}
              cursor="pointer"
              p={6}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              textAlign="center"
              transition="all 0.2s ease-in-out"
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "lg",
                bg: "blue.50",
              }}
            >
              <FaBirthdayCake size="50px" color="blue" />
              <Heading size="lg" mt={3} color="gray.800">
                Birthdays
              </Heading>
              <Text color="gray.600">See upcoming birthdays 🎂</Text>
            </LinkBox>

            {/* Name Days Link */}
            <LinkBox
              onClick={() => navigate("/namedays")}
              cursor="pointer"
              p={6}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              textAlign="center"
              transition="all 0.2s ease-in-out"
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "lg",
                bg: "green.50",
              }}
            >
              <FaCalendarAlt size="50px" color="green" />
              <Heading size="lg" mt={3} color="gray.800">
                Name Days
              </Heading>
              <Text color="gray.600">Check the name days 📖</Text>
            </LinkBox>
          </Flex>

          {/* Today's Celebrations Card */}
          <Box
            bgGradient="linear(to-r, teal.100, blue.100)"
            p={6}
            borderRadius="2xl"
            boxShadow="lg"
            w="80%"
            maxW="600px"
            textAlign="center"
            mb={10}
            cursor="pointer"
            transition="all 0.2s ease-in-out"
            _hover={{
              transform: "scale(1.03)",
              boxShadow: "xl",
              bgGradient: "linear(to-r, teal.200, blue.200)",
            }}
            onClick={() => navigate("/send-wish")}
          >
            <Heading size="lg" color="blue.800" mb={2}>
              🎊 Today's Celebrations
            </Heading>
            <Text fontSize="md" color="gray.700">
              Tap to see who’s celebrating today!
            </Text>
          </Box>

          {/* Fun Quote Section */}
          <Box mt={10} textAlign="center" maxW="600px">
            <FaQuoteLeft size="30px" color="gray" />
            <Text fontSize="lg" fontStyle="italic" color="gray.700">
              "Birthdays are a new start, a fresh beginning and a time to pursue
              new dreams."
            </Text>
          </Box>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default HomePage;
