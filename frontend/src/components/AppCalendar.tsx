import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useNamedays from "@/hooks/useNamedaysForDate";


const AppCalendar = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const { names, loading, error } = useNamedays(date);



    const displayDate =
        date?.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }) || "No date selected";

    return (
        <div className="flex flex-col lg:flex-row gap-4 w-full">
            {/* Calendar Section */}
            <div className="flex-1 max-w-[320px]">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                    className="w-full rounded-lg border shadow-sm p-3 text-sm"
                />
            </div>

            {/* Info Panel Section */}
            <div className="flex-1 flex flex-col justify-center bg-muted/70 rounded-2xl p-6 shadow-md relative border border-muted">
                <div className="text-center flex flex-col items-center space-y-2">
                    <h2 className="text-2xl font-bold text-primary">{displayDate}</h2>
                    {date && (<h3 className="text-lg font-medium text-muted-foreground">
                        Names being celebrated
                    </h3>)}
                    <Separator className="mt-2 w-1/2 bg-muted-foreground" />
                </div>

                <div className="mt-1 text-center">
                    {loading && (
                        <p className="text-sm text-muted-foreground italic">Loading...</p>
                    )}

                    {error && (
                        <p className="text-sm text-destructive font-semibold">{error}</p>
                    )}

                    {!loading && !error && date && names?.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No name days today.
                        </p>
                    )}

                    {!loading && !error && date && names?.length > 0 && (
                        <ScrollArea className="h-50 w-full rounded-md mt-2">
                            <div className="flex flex-wrap justify-center gap-2 px-4 py-3">
                                {names.map((person, index) => (
                                    <span
                                        key={index}
                                        className="bg-primary/90 hover:bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm transition"
                                    >
                                        {person.name}
                                    </span>
                                ))}
                            </div>
                            <ScrollBar
                                orientation="vertical"
                                className="bg-muted-foreground/50 hover:bg-muted-foreground/80"
                            />
                        </ScrollArea>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppCalendar;
