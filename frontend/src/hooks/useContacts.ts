import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { CanceledError } from "axios";

export interface Contact {
  id: number;
  user_id: number;
  name: string;
  surname: string;
  email?: string;
  birthdate?: Date;
  created_at: Date;
}

const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState("");
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const controller = new AbortController(); 

    axiosPrivate
      .get<Contact[]>("/api/contacts", {
        signal: controller.signal, 
      })
      .then((res) => setContacts(res.data))
      .catch((err) => {
        if(err instanceof CanceledError) return;
        setError(err.message);
    });

      return () => controller.abort(); 
  }, [axiosPrivate]);

  return {contacts, error}
}

export default useContacts