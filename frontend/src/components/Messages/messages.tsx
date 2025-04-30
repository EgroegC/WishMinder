import { useEffect, useState } from "react";
import { Box, Flex, Text, SimpleGrid, Heading } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import "./messages.css";

interface Message {
  id: number;
  text: string;
}

function Messages() {
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();

  const { type, phone } = location.state as {
    type: "birthday" | "nameday";
    phone: string;
  };

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    axiosPrivate
      .get<Message[]>(`/api/messages?type=${type}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  }, [axiosPrivate, type]);

  const handleSelectMessage = (messageText: string) => {
    window.location.href = `sms:${phone}?&body=${encodeURIComponent(
      messageText
    )}`;
  };

  return (
    <Flex direction="column" className="messages-container">
      <div className="header">
        <Heading size="md">
          Choose a {type === "birthday" ? "Birthday" : "Nameday"} Message
        </Heading>
      </div>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            className="message-box"
            onClick={() => handleSelectMessage(msg.text)}
          >
            <Text>{msg.text}</Text>
          </Box>
        ))}
        <Box
          key={"text"}
          className="message-box"
          onClick={() => handleSelectMessage("")}
        >
          <Text>Add your own message</Text>
        </Box>
      </SimpleGrid>
    </Flex>
  );
}

export default Messages;
