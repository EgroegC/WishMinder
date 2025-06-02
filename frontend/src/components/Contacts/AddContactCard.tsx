import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { HiUpload } from "react-icons/hi";
import AlertMessage from "../Alert/AlertMessage";

interface Duplicates {
  name: string;
  surname: string;
}

interface PartialContact {
  name: string;
  surname: string;
  phone: string;
  email?: string;
  birthdate?: Date;
}

const AddContactCard = ({
  onContactAdded,
}: {
  onContactAdded: (mess?: string) => void;
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleVcfUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleVcfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setError("No file selected. Please choose a contact card (.vcf) file.");
      return;
    }

    const text = await file.text();
    const contacts = parseVcfToContacts(text);

    if (!contacts || contacts.length === 0) {
      setError("The uploaded file does not contain any valid contacts.");
      return;
    }

    axiosPrivate
      .post("/api/contacts/import/vcf", {
        contacts,
      })
      .then((res) => {
        const updatedContacts = (res.data.updated as Duplicates[])
          .map((c) => `${c.name} ${c.surname}`)
          .join(", ");

        onContactAdded(
          `${res.data.insertedCount} new contacts imported, ${res.data.updatedCount} replaced: ${updatedContacts}`
        );
      })
      .catch((err) => {
        setError(err.request.response);
      });
  };

  return (
    <>
      <Button
        variant="ghost"
        color="gray.700"
        fontWeight="medium"
        size="md"
        mx="auto"
        display="block"
        onClick={handleVcfUploadClick}
        _hover={{
          textDecoration: "underline",
        }}
        _active={{
          bg: "gray.200",
        }}
      >
        <Flex align="center" gap={2}>
          <Icon as={HiUpload} boxSize={5} />
          <Text>Upload Contact Card (.vcf)</Text>
        </Flex>
      </Button>

      {error && (
        <AlertMessage
          status="error"
          message={`Failed to store contacts: ${error}`}
        />
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept=".vcf"
        onChange={handleVcfUpload}
        style={{ display: "none" }}
      />
    </>
  );
};

const parseVcfToContacts = (vcfText: string): PartialContact[] => {
  const contacts: PartialContact[] = [];
  const cards = vcfText.split("BEGIN:VCARD").slice(1);

  for (const card of cards) {
    let name = "";
    let surname = "";
    let phone = "";
    let email: string | undefined;
    let birthdate: Date | undefined;

    const lines = card.split("\n").map((line) => line.trim());

    for (const line of lines) {
      if (line.startsWith("FN:")) {
        const fullName = line.replace("FN:", "").trim();
        const parts = fullName.split(" ");
        name = parts[0];
        surname = parts.slice(1).join(" ");
      }

      if (line.startsWith("TEL")) {
        const telParts = line.split(":");
        if (telParts.length > 1) {
          phone = telParts[1].trim();
        }
      }

      if (line.startsWith("EMAIL:")) {
        email = line.replace("EMAIL:", "").trim();
      }

      if (line.startsWith("BDAY:")) {
        const rawDate = line.replace("BDAY:", "").trim();
        const parsedDate = new Date(rawDate);
        if (!isNaN(parsedDate.getTime())) {
          birthdate = parsedDate;
        }
      }
    }

    if (name && surname && phone) {
      contacts.push({
        name,
        surname,
        phone,
        email,
        birthdate,
      });
    }
  }

  return contacts;
};

export default AddContactCard;
