import { Card } from "@/components/ui/card";
import ProfileImage from "@/app/components/ProfileImage";

interface RankCardProps {
    rank: number;
    name: string;
    coins: number;
    profileSrc?: string;
    className?: string;
}

export default function RankCard({ rank, name, coins, profileSrc, className = "" }: RankCardProps) {
    const medalByRank: Record<number, string> = {
        1: "🥇",
        2: "🥈",
        3: "🥉",
    };

    const medal = medalByRank[rank];

    return (
        <Card className={`flex items-center gap-4 p-4 rounded-2xl border-0 bg-white ${className}`}>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-500 font-semibold">
                {rank}
            </div>
            <ProfileImage src={profileSrc} size="md" />
            <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-semibold truncate">{name}</p>
                <p className="text-sm text-gray-500 truncate">{coins.toLocaleString()} points</p>
            </div>
            {medal && (
                <div className="ml-auto text-2xl select-none" aria-label={`Rank ${rank} medal`}>
                    {medal}
                </div>
            )}
        </Card>
    );
}


