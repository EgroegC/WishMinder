import NavBar from "../components/NavBar/NavBar";
import { Flex, Grid, GridItem, Input } from "@chakra-ui/react";
import CelebrationBox from "@/components/Celebrations/CelebrationBox";
import CelebrationList from "@/components/Celebrations/CelebrationList";
import { useState } from "react";

function BirthdayPage() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <Grid
      templateAreas={`"nav nav"
                      "main main"`}
      gridTemplateRows={"60px 1fr"}
      gridTemplateColumns={"1fr"}
      minH="100vh"
    >
      {/* Navbar */}
      <GridItem area="nav" p={-1} bg="white" boxShadow="sm">
        <NavBar />
      </GridItem>

      {/* Main Content */}
      <GridItem area="main" bg="gray.100" p={6}>
        <Flex
          justifyContent="center"
          gap={6}
          flexWrap="wrap"
          maxW="80%"
          mx="auto"
        >
          {/* 🔍 Search Bar */}
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="white"
            maxW="60%"
            boxShadow="sm"
          />

          <CelebrationBox
            heading="🎉 Namedays"
            children={
              <CelebrationList isBirthday={false} searchTerm={searchTerm} />
            }
          />
        </Flex>
      </GridItem>
    </Grid>
  );
}

export default BirthdayPage;
