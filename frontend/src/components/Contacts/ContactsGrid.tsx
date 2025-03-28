import useContacts from "@/hooks/useContacts";

const ContactsGrid = () => {
  const { contacts, error } = useContacts();

  return (
    <>
      {error && <p>{error}</p>}
      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.name} {contact.surname}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ContactsGrid;
