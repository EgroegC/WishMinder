import AppCalendar from "@/components/AppCalendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import useTodaysCelebrations from "@/hooks/useTodaysCelebrations";
import { Cake } from "lucide-react"
import { CalendarHeart } from "lucide-react";
import { type Celebration } from '../hooks/useTodaysCelebrations';
import TodaysCelebrations from '../components/TodaysCelebrations';
import { Spinner } from "@/components/Spinner";

const HomePage = () => {
    const { accessToken } = useAuth();
    const { celebrations, error, loading } = useTodaysCelebrations(!!accessToken);

    const birthdayCelebrants = accessToken ? getTodaysBirthdayCelebrants(celebrations) : [];
    const namedayCelebrants = accessToken ? getTodaysNamedayCelebrants(celebrations) : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-4">
            <div className="bg-primary-foreground p-4 rounded-lg">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Cake className="w-5 h-5 text-primary" />
                            Today's Birthdays
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[150px] rounded-md">
                        {loading ? (
                            <Spinner />
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : accessToken ? (
                            <TodaysCelebrations celebrations={birthdayCelebrants} type="birthday" />
                        ) : (
                            <div className="text-center space-y-1">
                                <p className="text-sm text-muted-foreground">No birthdays today</p>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-primary font-medium">Sign up</span> to see today's and upcoming birthdays of your contacts.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="bg-primary-foreground p-4 rounded-lg">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarHeart className="w-5 h-5 text-primary" />
                            Today's Namedays
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[150px] rounded-md">
                        {loading ? (
                            <Spinner />
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : accessToken ? (
                            <TodaysCelebrations celebrations={namedayCelebrants} type="nameday" />
                        ) : (
                            <div className="text-center space-y-1">
                                <p className="text-sm text-muted-foreground">No Namedays today</p>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-primary font-medium">Sign up</span> to see today's and upcoming namedays of your contacts.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2">
                <AppCalendar />
            </div>
        </div>
    )
}

function getTodaysNamedayCelebrants(celebrations: Celebration[]): Celebration[] {
    return celebrations.filter((c) => c.type === "nameday" && c.name?.trim());
}

function getTodaysBirthdayCelebrants(celebrations: Celebration[]): Celebration[] {
    return celebrations.filter((c) => c.type === "birthday" && c.name?.trim());
}


export default HomePage
