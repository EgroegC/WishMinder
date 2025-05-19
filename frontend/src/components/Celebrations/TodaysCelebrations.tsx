import { Box, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CelebrationBox from "@/components/Celebrations/CelebrationBox";
import ListRow from "@/components/Celebrations/ListRow";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Contact } from "../../hooks/useContacts";
import { useEffect, useState } from "react";
import { CanceledError } from "axios";
import { ButtonConfig } from "./ContactCard";

type Celebration = Contact & {
  type: "birthday" | "nameday";
};

function TodaysCelebrations() {
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [error, setError] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const today = new Date();

  useEffect(() => {
    const controller = new AbortController();

    axiosPrivate
      .get<Celebration[]>("/api/celebrations/today", {
        signal: controller.signal,
      })
      .then((res) => setCelebrations(res.data))
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

    return () => controller.abort();
  }, [axiosPrivate]);

  const handleMessage =
    (type: "birthday" | "nameday") => (contact: Contact) => {
      navigate("/messages", {
        state: {
          type,
          phone: contact.phone,
        },
      });
    };

  const buttons = (type: "birthday" | "nameday"): ButtonConfig[] => {
    return [
      { label: "Message", variant: "info", onClick: handleMessage(type) },
      { label: "Call", variant: "success", onClick: handleCall },
    ];
  };

  const birthdayContacts = filterCelebrationContacts(celebrations, "birthday");
  const namedayContacts = filterCelebrationContacts(celebrations, "nameday");

  return (
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
        <>
          {birthdayContacts && birthdayContacts.length > 0 ? (
            <CelebrationBox heading="🎉 Today's Birthdays">
              <ListRow
                key={today.getMonth() + 1}
                month={today.getMonth() + 1}
                contacts={birthdayContacts}
                namedayDateByMonth={{}}
                isBirthday={true}
                currentYear={today.getFullYear()}
                buttons={buttons("birthday")}
              />
            </CelebrationBox>
          ) : (
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="md"
              textAlign="center"
              w="100%"
              maxW="800px"
              mt={4}
            >
              <p style={{ color: "black" }}>🎈 No birthdays today</p>
            </Box>
          )}
          {namedayContacts && namedayContacts.length > 0 ? (
            <CelebrationBox heading="🎉 Today's Namedays">
              <ListRow
                key={today.getMonth() + 1}
                month={today.getMonth() + 1}
                contacts={namedayContacts}
                namedayDateByMonth={{
                  [today.getMonth() + 1]: [today],
                }}
                isBirthday={false}
                currentYear={today.getFullYear()}
                buttons={buttons("nameday")}
              />
            </CelebrationBox>
          ) : (
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="md"
              textAlign="center"
              w="100%"
              maxW="800px"
              mt={4}
            >
              <p style={{ color: "black" }}>🎈 No namedays today</p>
            </Box>
          )}
        </>
      )}
    </Flex>
  );
}

const handleCall = (contact: Contact) => {
  window.location.href = `tel:${contact.phone}`;
};

const filterCelebrationContacts = (
  celebrations: Celebration[],
  type?: "birthday" | "nameday"
): Contact[] => {
  let filtered = celebrations;

  if (type) {
    filtered = celebrations.filter((c) => c.type === type);
  }

  return filtered.map((c) => ({
    id: c.id,
    user_id: c.user_id,
    name: c.name,
    surname: c.surname,
    phone: c.phone,
    email: c.email,
    birthdate: c.birthdate,
    created_at: c.created_at,
  }));
};

export default TodaysCelebrations;
