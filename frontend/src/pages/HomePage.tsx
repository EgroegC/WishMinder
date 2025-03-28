import ContactsGrid from "@/components/Contacts/ContactsGrid";
import NavBar from "@/components/NavBar";
import { Grid, GridItem } from "@chakra-ui/react";

function HomePage() {
  return (
    <Grid
      templateAreas={`"nav nav"
                      "main main"`}
      gridTemplateRows={"60px 1fr"}
      gridTemplateColumns={"1fr"}
      minH="100vh"
    >
      <GridItem area="nav" p={4}>
        <NavBar />
      </GridItem>
      <GridItem area="main" bg="dodgerblue" p={4}>
        <ContactsGrid />
      </GridItem>
    </Grid>
  );
}

export default HomePage;
