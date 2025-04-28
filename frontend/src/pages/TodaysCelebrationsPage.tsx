import NavBar from "../components/NavBar/NavBar";
import { Grid, GridItem } from "@chakra-ui/react";
import TodaysCelebrations from "@/components/Celebrations/TodaysCelebrations";

function TodaysCelebrationsPage() {
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
        <TodaysCelebrations />
      </GridItem>
    </Grid>
  );
}

export default TodaysCelebrationsPage;
