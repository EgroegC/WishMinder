import NavBar from "../components/NavBar/NavBar";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import CelebrationBox from "@/components/Celebrations/CelebrationBox";
import CelebrationList from "@/components/Celebrations/CelebrationList";

function BirthdayPage() {
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
          <CelebrationBox
            heading="🎉 Namedays"
            children={<CelebrationList isBirthday={false} />}
          />
        </Flex>
      </GridItem>
    </Grid>
  );
}

export default BirthdayPage;
