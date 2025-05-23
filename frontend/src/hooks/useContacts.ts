import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { CanceledError } from "axios";

export interface Contact {
  id: number;
  user_id: number;
  name: string;
  surname: string;
  phone: string;
  email?: string;
  birthdate?: Date;
  created_at: Date;
}

const useContacts = (refreshTrigger = 0) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController(); 

    axiosPrivate
      .get<Contact[]>("/api/contacts", {
        signal: controller.signal, 
      })
      .then((res) => setContacts(res.data))
      .catch((err) => {
        if(err instanceof CanceledError) return;
        setError(err.message);
      })
      .finally(() => setLoading(false));

      return () => controller.abort(); 
  }, [axiosPrivate, refreshTrigger]);

  return {contacts, error, loading}
}

export default useContacts