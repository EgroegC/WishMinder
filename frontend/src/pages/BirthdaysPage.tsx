import { useState } from "react";
import { Flex, Grid, GridItem, Input } from "@chakra-ui/react";
import NavBar from "../components/NavBar/NavBar";
import CelebrationBox from "@/components/Celebrations/CelebrationBox";
import CelebrationList from "@/components/Celebrations/CelebrationList";

function BirthdayPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "main main"`,
      }}
      gridTemplateRows={"60px 1fr"}
      gridTemplateColumns={"1fr"}
      minH="100vh"
    >
      <GridItem area="nav" p={0} bg="white" boxShadow="sm">
        <NavBar />
      </GridItem>

      <GridItem area="main" bg="gray.100" p={3} overflowX="hidden">
        <Flex
          w="100%"
          justifyContent="center"
          direction={"column"}
          gap={6}
          flexWrap="wrap"
          maxW={{ base: "100%", md: "90%", lg: "62%" }}
          mx="auto"
        >
          {/* 🔍 Search Bar */}
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="white"
            maxW="100%"
            boxShadow="sm"
            color="black"
            _placeholder={{ color: "gray.400" }}
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px #3182ce",
              outline: "none",
            }}
          />

          <CelebrationBox
            heading="🎉 Upcomming Birthdays"
            children={
              <CelebrationList isBirthday={true} searchTerm={searchTerm} />
            }
          />
        </Flex>
      </GridItem>
    </Grid>
  );
}

export default BirthdayPage;
