import { useState } from "react";
import { HStack, Image, Text, Box, Button } from "@chakra-ui/react";
import logo from "../../assets/openart-raw.jpg";
import profileImage from "../../assets/profile_image.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  // Toggle the dropdown
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <HStack justify="space-between" w="100%" p={4}>
      {/* Logo */}
      <HStack>
        <Image
          src={logo}
          boxSize="35px"
          borderRadius="10px"
          onClick={() => navigate("/")}
        />
        <Text fontSize="xl" color={"black"}>
          NavBar
        </Text>
      </HStack>

      {/* Profile and Custom Dropdown */}
      <HStack>
        <Box
          width="30px"
          height="30px"
          borderRadius="full"
          bg="gray.400"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          color="white"
        >
          <Image
            src={profileImage}
            boxSize="38px"
            borderRadius="10px"
            onClick={toggleDropdown}
          ></Image>
        </Box>

        {/* Custom Dropdown Menu */}
        {isDropdownOpen && (
          <Box
            position="absolute"
            right="50px"
            mt="1"
            p="1"
            bg="white"
            borderRadius="md"
            boxShadow="md"
            zIndex="1"
          >
            <Button
              variant="outline"
              colorScheme="red"
              w="100%"
              onClick={() => setAccessToken(null)}
              _hover={{
                bg: "blue.100", // Hover effect
                color: "blue.700",
              }}
            >
              Log Out
            </Button>
          </Box>
        )}
      </HStack>
    </HStack>
  );
};

export default NavBar;
