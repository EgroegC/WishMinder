import NavBar from "../components/HomePage/NavBar";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import BirthdayBox from "@/components/Birthdays/BirthdayBox";
import BirthdayList from "@/components/Birthdays/BirthdayList";

function HomePage() {
  return (
    <Grid
      templateAreas={`"nav nav"
                      "main main"`}
      gridTemplateRows={"60px 1fr"}
      gridTemplateColumns={"1fr"}
      minH="100vh"
    >
      {/* Navbar */}
      <GridItem area="nav" p={-1}>
        <NavBar />
      </GridItem>

      {/* Main Content */}
      <GridItem area="main" bg="gray.100" p={6}>
        <Flex
          justifyContent="center"
          gap={6}
          flexWrap="wrap"
          maxW="80%" // Limits max width to 80% of the page
          mx="auto" // Centers content
        >
          <BirthdayBox heading="🎉 Birthdays" children={<BirthdayList />} />
        </Flex>
      </GridItem>
    </Grid>
  );
}

export default HomePage;
