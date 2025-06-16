import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/Spinner";

interface Message {
    id: number;
    text: string;
}

export default function Messages() {
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();

    const { type, phone } = location.state as {
        type: "birthday" | "nameday";
        phone: string;
    };

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axiosPrivate
            .get<Message[]>(`/api/messages?type=${type}`)
            .then((res) => setMessages(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [axiosPrivate, type]);

    const handleSelectMessage = (messageText: string) => {
        window.location.href = `sms:${phone}?&body=${encodeURIComponent(
            messageText
        )}`;
    };

    return (
        <div className="flex flex-col space-y-4 p-4 max-w-5xl mx-auto">
            <header className="mb-4">
                Choose a {type === "birthday" ? "Birthday" : "Nameday"} Message
            </header>

            {loading ? (
                <div className="flex justify-center">
                    <Spinner />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {messages.map((msg) => (
                        <Card
                            key={msg.id}
                            onClick={() => handleSelectMessage(msg.text)}
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <CardContent>
                                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                            </CardContent>
                        </Card>
                    ))}
                    <Card
                        key="custom-message"
                        onClick={() => handleSelectMessage("")}
                        className="cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center font-medium text-primary"
                    >
                        <CardContent>Add your own message</CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
