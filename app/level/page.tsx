import LevelMap from "./components/LevelMap";
import BottomNav from "@/app/components/BottomNav";
import TopNav from "@/app/components/TopNav";
import PlayCurrentLevel from "./components/PlayCurrentLevel";

export default function LevelPage() {
    return (
        <div className="min-h-screen w-full bg-primary-purple overflow-x-hidden">
            <TopNav />
            <PlayCurrentLevel />
            <LevelMap />
            <BottomNav />
        </div>
    );
}