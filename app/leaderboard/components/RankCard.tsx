import { Card } from "@/components/ui/card";
import ProfileImage from "@/app/components/ProfileImage";

interface RankCardProps {
    rank: number;
    username: string;
    coins: number;
    profileSrc?: string;
    className?: string;
}

export default function RankCard({ rank, username, coins, profileSrc, className = "" }: RankCardProps) {
    const medalByRank: Record<number, string> = {
        1: "🥇",
        2: "🥈",
        3: "🥉",
    };

    const medal = medalByRank[rank];

    return (
        <Card className={`flex items-center gap-4 px-4 py-2 rounded-2xl border-0 bg-white ${className}`}>
            <div className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 font-semibold">
                {rank}
            </div>
            <ProfileImage src={profileSrc} size="sm" />
            <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-semibold truncate">{username}</p>
                <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                    <img src="/images/coin.png" alt="Coin" className="w-4 h-4" />
                    {coins.toLocaleString()}
                </p>
            </div>
            {medal && (
                <div className="ml-auto text-2xl select-none" aria-label={`Rank ${rank} medal`}>
                    {medal}
                </div>
            )}
        </Card>
    );
}


