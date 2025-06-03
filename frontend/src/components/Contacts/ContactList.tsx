import { Contact } from "@/hooks/useContacts";
import { useMemo } from "react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { filterContactsBySearchTerm } from "../Celebrations/MemoHelpers";
import { ButtonConfig } from "../Celebrations/ContactCard";
import React from "react";

interface Props {
  contacts: Contact[];
  searchTerm: string;
  buttons: ButtonConfig[];
}

const ContactList = ({ searchTerm, buttons, contacts }: Props) => {
  const filteredContacts = useMemo(
    () => filterContactsBySearchTerm(contacts, searchTerm),
    [contacts, searchTerm]
  );

  return (
    <Box overflowY="auto">
      {filteredContacts.length === 0 ? (
        <Text fontSize="sm" color="gray.500" textAlign="center">
          No contacts found.
        </Text>
      ) : (
        filteredContacts.map((contact) => (
          <React.Fragment key={contact.id}>
            <Text
              key={contact.id}
              fontSize="sm"
              mb={1}
              color="gray.800"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              {contact.name} {contact.surname}
            </Text>

            <HStack gap={6}>
              {buttons.map((btn, idx) => (
                <Button
                  key={idx}
                  size={"xs"}
                  borderColor={colorStyles[btn.variant]}
                  _hover={{ backgroundColor: colorStyles[btn.variant] }}
                  className={`listrow_button_${idx}`}
                  onClick={() => btn.onClick(contact)}
                >
                  {btn.label}
                </Button>
              ))}
            </HStack>
          </React.Fragment>
        ))
      )}
    </Box>
  );
};

const colorStyles: Record<"danger" | "success" | "info", string> = {
  danger: "red.500",
  success: "green.500",
  info: "#3182ce",
};

export default ContactList;
