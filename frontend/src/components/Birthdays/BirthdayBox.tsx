import { Box, Heading } from "@chakra-ui/react";
import { ReactElement } from "react";

interface Props {
  heading: string;
  children: ReactElement;
}

const BirthdayBox = ({ heading, children }: Props) => {
  return (
    <div>
      <Box
        bg="white"
        p={4}
        borderRadius="lg"
        boxShadow="md"
        w="100%"
        maxW="1000px"
      >
        <Heading size={"4xl"} mb={2} color="blue.500" textAlign="center">
          {heading}
        </Heading>
        {children}
      </Box>
    </div>
  );
};

export default BirthdayBox;
