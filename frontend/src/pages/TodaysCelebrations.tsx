import NavBar from "../components/NavBar/NavBar";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import CelebrationBox from "@/components/Celebrations/CelebrationBox";
import ListRow from "@/components/Celebrations/ListRow";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Contact } from "../hooks/useContacts";
import { useEffect, useState } from "react";
import { CanceledError } from "axios";

function BirthdayPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const today = new Date();
  const isBirthday = true;

  useEffect(() => {
    const controller = new AbortController();

    axiosPrivate
      .get<Contact[]>("/api/contacts/haveBirthday", {
        signal: controller.signal,
      })
      .then((res) => setContacts(res.data))
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

    return () => controller.abort();
  }, [axiosPrivate]);

  const handleMessage = (contact: Contact) => {
    window.location.href = `sms:${contact.phone}`;
  };

  const handleCall = (contact: Contact) => {
    window.location.href = `tel:${contact.phone}`;
  };

  const buttons = [
    { label: "Message", onClick: handleMessage },
    { label: "Call", onClick: handleCall },
  ];

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
          direction={"column"}
          gap={6}
          flexWrap="wrap"
          maxW="48%"
          mx="auto"
        >
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <CelebrationBox
              heading="🎉 Todyay's Birthdays"
              children={
                <ListRow
                  key={today.getMonth() + 1}
                  month={today.getMonth() + 1}
                  contacts={contacts}
                  namedayDateByMonth={{}}
                  isBirthday={isBirthday}
                  currentYear={today.getFullYear()}
                  buttons={buttons}
                />
              }
            />
          )}
        </Flex>
      </GridItem>
    </Grid>
  );
}

export default BirthdayPage;
