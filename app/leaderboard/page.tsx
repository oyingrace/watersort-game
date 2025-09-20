//import TopNav from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";
import SwitchNav from "./components/SwitchNav";
import Weekly from "./components/Weekly";

export default function LeaderboardPage() {
	return (
		<div className="min-h-screen w-full bg-primary-purple overflow-x-hidden">
			{/* <TopNav /> */}
			<SwitchNav />
			
           <Weekly />
           <BottomNav />
		</div>
	);
}