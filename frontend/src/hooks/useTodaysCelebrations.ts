import { useEffect, useState } from 'react';
import useAxiosPrivate from './useAxiosPrivate';
import { CanceledError } from 'axios';

export type Celebration = {
    id: string;
    user_id: number;
    name: string;
    surname: string;
    phone: string;
    email?: string;
    birthdate?: string;
    type: 'birthday' | 'nameday';
};

const useTodaysCelebrations = (enabled = true) => {
    const [celebrations, setCelebrations] = useState<Celebration[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (!enabled) return;

        const controller = new AbortController();
        setLoading(true);

        axiosPrivate
            .get<Celebration[]>('/api/celebrations/today', {
                signal: controller.signal,
            })
            .then((res) => setCelebrations(res.data))
            .catch((err) => {
                if (err instanceof CanceledError) return;
                setError(err.response.data);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [axiosPrivate, enabled]);

    return { celebrations, error, loading };
};

export default useTodaysCelebrations;
