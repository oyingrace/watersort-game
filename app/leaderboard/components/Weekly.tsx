"use client";

import RankCard from "./RankCard";
import data from "./WeeklyRankers.json";

export default function Weekly() {
	return (
		<div className="px-4 pt-6 space-y-3 overflow-x-hidden">
			{data.map((user) => (
				<RankCard
					key={user.rank}
					rank={user.rank}
					name={user.name}
					coins={user.coins || 0}
					profileSrc={user.profileSrc}
					className="shadow"
				/>
			))}
		</div>
	);
}
