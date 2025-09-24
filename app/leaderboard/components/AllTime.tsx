"use client";
import RankCard from "./RankCard";
import data from "./WeeklyRankers.json";

export default function AllTime() {
    return (
        <div className="px-4 pt-6 space-y-3">
			{data.map((user) => (
				<RankCard
					key={user.rank}
					rank={user.rank}
					username={user.username}
					coins={user.coins || 0}
					profileSrc={user.profileSrc}
					className="shadow"
				/>
			))}
		</div>
    );
}

