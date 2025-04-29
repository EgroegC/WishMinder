import Messages from "@/components/Messages/messages";
import NavBar from "@/components/NavBar/NavBar";
import { Grid, GridItem } from "@chakra-ui/react";

function MessagesPage() {
  return (
    <Grid
      templateAreas={`"nav nav"
                      "main main"`}
      gridTemplateRows={"60px 1fr"}
      gridTemplateColumns={"1fr"}
      minH="100vh"
    >
      <GridItem area="nav" p={-1} bg="white" boxShadow="sm">
        <NavBar />
      </GridItem>

      <GridItem area="main" bg="gray.100" p={6}>
        <Messages />
      </GridItem>
    </Grid>
  );
}

export default MessagesPage;
