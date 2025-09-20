import LevelMap from "./components/LevelMap";
import BottomNav from "@/app/components/BottomNav";
import TopNav from "@/app/components/TopNav";

export default function LevelPage() {
    return (
        <div className="min-h-screen w-full bg-primary-purple overflow-x-hidden">
            <TopNav />
            <LevelMap />
            <BottomNav />
        </div>
    );
}