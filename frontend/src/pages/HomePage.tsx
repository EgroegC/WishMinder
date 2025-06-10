import AppCalendar from "@/components/AppCalendar"
import CelebrationCard from "@/components/CelebrationCard"
import { Cake } from "lucide-react"
import { CalendarHeart } from "lucide-react";

const HomePage = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-4">
            <div className="bg-primary-foreground p-4 rounded-lg"> <CelebrationCard
                icon={Cake}
                title="Today's Birthdays"
                description="Here will be the list of today’s birthdays."
                actionText="See upcoming birthdays →"
                onActionClick={() => console.log("Go to upcoming birthdays")}
            /> </div>
            <div className="bg-primary-foreground p-4 rounded-lg"> <CelebrationCard
                icon={CalendarHeart}
                title="Today's Namedays"
                description="Here will be the list of today’s namedays."
                actionText="See upcoming namedays →"
                onActionClick={() => console.log("Go to upcoming birthdays")}
            /> </div>
            <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2">
                <AppCalendar />
            </div>
        </div>
    )
}

export default HomePage
