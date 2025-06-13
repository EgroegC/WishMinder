import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { CanceledError } from "axios";

export interface Nameday {
    name_id: number;
    name: string;
    nameday_date: string;
}

const useUpcomingNamedays = () => {
    const [upcNamedays, setUpcNamedays] = useState<Nameday[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {

        setLoading(true);
        const controller = new AbortController();

        axiosPrivate
            .get<Nameday[]>("/api/namedays/upcoming", {
                signal: controller.signal,
            })
            .then((res) => setUpcNamedays(res.data))
            .catch((err) => {
                if (err instanceof CanceledError) return;
                setError(err.message);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [axiosPrivate]);

    return { upcNamedays, error, loading }
}

export default useUpcomingNamedays