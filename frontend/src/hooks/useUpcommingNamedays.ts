import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { CanceledError } from "axios";

export interface Nameday {
  name_id: number;
  name: string;
  nameday_date: Date;
}

const useUpcomingNamedays = () => {
  const [upcNamedays, setUpcNamedays] = useState<Nameday[]>([]);
  const [error, setError] = useState("");
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const controller = new AbortController(); 

    axiosPrivate
      .get<Nameday[]>("/api/namedays/upcoming", {
        signal: controller.signal, 
      })
      .then((res) => setUpcNamedays(res.data))
      .catch((err) => {
        if(err instanceof CanceledError) return;
        setError(err.message);
    });

      return () => controller.abort(); 
  }, [axiosPrivate]);

  return {upcNamedays, error}
}

export default useUpcomingNamedays