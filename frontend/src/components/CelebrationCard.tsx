import type { LucideIcon } from "lucide-react";

type InfoCardProps = {
    icon: LucideIcon;
    title: string;
    description: string;
    actionText?: string;
    onActionClick?: () => void;
};

const InfoCard = ({
    icon: Icon,
    title,
    description,
    actionText,
    onActionClick,
}: InfoCardProps) => {
    return (
        <div className="flex flex-col items-center justify-center bg-muted p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-primary" />
                {title}
            </h2>
            <p className="text-sm text-foreground mb-1">{description}</p>
            {actionText && (
                <button
                    onClick={onActionClick}
                    className="text-primary text-sm underline hover:text-primary/80 transition"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
};

export default InfoCard;
