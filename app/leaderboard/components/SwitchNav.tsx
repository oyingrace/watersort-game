"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Weekly from "./Weekly";
import AllTime from "./AllTime";

export default function SwitchNav() {
    const [active, setActive] = useState<"weekly" | "all-time">("weekly");
    const isWeekly = active === "weekly";
    const isAllTime = active === "all-time";

    return (
        <div className="pt-6 px-4 py-3 overflow-x-hidden">
            <div className="flex items-center justify-center">
                <h1 className="text-white text-3xl">Leaderboard</h1>
            </div>
            <div className="pt-8 flex items-center justify-center gap-6">
                <Button
                    onClick={() => setActive("weekly")}
                    variant={isWeekly ? "secondary" : "ghost"}
                    className={
                        (isWeekly
                            ? "text-white bg-secondary-purple border border-secondary-purple"
                            : "text-secondary-purple hover:text-white hover:bg-secondary-purple") +
                        " rounded-xl px-4 h-6"
                    }
                >
                    Weekly
                </Button>
                <Button
                    onClick={() => setActive("all-time")}
                    variant={isAllTime ? "secondary" : "ghost"}
                    className={
                        (isAllTime
                            ? "text-white bg-secondary-purple border border-secondary-purple"
                            : "text-secondary-purple hover:text-white hover:bg-secondary-purple") +
                        " rounded-xl px-4 h-6"
                    }
                >
                    All Time
                </Button>
            </div>
            <div className="mt-4">
                {isWeekly ? <Weekly /> : <AllTime />}
            </div>
        </div>
    );
}

