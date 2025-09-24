//import TopNav from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";
import SwitchNav from "./components/SwitchNav";

export default function LeaderboardPage() {
	return (
		<div className="min-h-screen w-full bg-primary-purple overflow-x-hidden">
			{/* <TopNav /> */}
			<SwitchNav />
           <BottomNav />
		</div>
	);
}