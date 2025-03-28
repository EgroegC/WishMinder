import { HStack, Image, Text } from "@chakra-ui/react";
import logo from "../assets/openart-raw.jpg";

const NavBar = () => {
  return (
    <HStack>
      <Image src={logo} boxSize="35px" borderRadius="10px" />
      <Text>NavBar</Text>
    </HStack>
  );
};

export default NavBar;
