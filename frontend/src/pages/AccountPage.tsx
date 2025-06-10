import UserInfoCard from "@/components/account/UserInfo";

const Account = () => {
    return (
        <div className="mt-4 flex flex-col xl:flex-row gap-8">
            {/* LEFT */}
            <div className="w-full xl:w-1/3 space-y-6">
                <UserInfoCard />
                <div className="bg-primary-foreground p-4 rounded-lg"> NOTIFICATIONS </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-2/3 space-y-6">
                <div className="bg-primary-foreground p-4 rounded-lg"> CONTACTS </div>
            </div>
        </div>
    );
}

export default Account