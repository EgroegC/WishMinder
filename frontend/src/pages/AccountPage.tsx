import Notifications from "@/components/account/Notifications";
import UserInfo from "@/components/account/UserInfo";
import Contacts from "@/components/account/Contacts";

const Account = () => {
    return (
        <div className="mt-4 flex flex-col xl:flex-row gap-8">
            {/* LEFT */}
            <div className="w-full xl:w-1/3 space-y-6">
                <UserInfo />
                <Notifications />
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-2/3 space-y-6">
                <Contacts />
            </div>
        </div>
    );
}

export default Account