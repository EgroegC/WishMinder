import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { CanceledError } from "axios";
import { Spinner } from "../Spinner";

type User = {
    name: string;
    email: string;
};

export default function UserInfoCard() {
    const axiosPrivate = useAxiosPrivate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError("");

        axiosPrivate
            .get("/api/users/me", {
                signal: controller.signal,
            })
            .then((res) => setUser(res.data))
            .catch((err) => {
                if (err instanceof CanceledError) return;
                setError(err.message || "Failed to load user info.");
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [axiosPrivate]);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-sm mx-auto">
            <h1 className="text-2xl font-semibold text-primary mb-6 text-center">
                User Information
            </h1>
            <div className="flex flex-col items-center space-y-6">
                <Avatar className="w-24 h-24">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
                    <AvatarFallback></AvatarFallback>
                </Avatar>

                {error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : loading ? (
                    <Spinner />
                ) : (
                    <div className="w-full space-y-4 text-gray-700 dark:text-gray-300">
                        {[
                            { label: "Username", value: user?.name },
                            { label: "Email", value: user?.email },
                            { label: "Role", value: <Badge className="uppercase">User</Badge> },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between">
                                <div className="w-28 font-semibold text-gray-500 dark:text-gray-400">
                                    {label}:
                                </div>
                                <div className="text-gray-900 dark:text-gray-100">{value}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
