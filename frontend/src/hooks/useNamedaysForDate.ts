import { useEffect, useState } from "react";
import { CanceledError } from "axios";
import apiClient from "@/services/api-client";

function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

const useNamedays = (date: Date | undefined) => {
    const [names, setNames] = useState<{ name: string }[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!date) return;

        const formattedDate = formatDateLocal(date);
        const controller = new AbortController();

        setLoading(true);

        apiClient
            .get(`/api/namedays/${formattedDate}`, {
                withCredentials: true,
                signal: controller.signal,
            })
            .then((res) => {
                setNames(res.data);
                setError("");
            })
            .catch((err) => {
                if (err instanceof CanceledError) return;
                setError("Failed to load today's celebrations.");
                console.error(err);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [date]);

    return { names, loading, error };
};

export default useNamedays;
