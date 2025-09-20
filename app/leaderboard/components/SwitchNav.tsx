"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

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
                            ? "text-white text-xl bg-secondary-purple border border-secondary-purple"
                            : "text-secondary-purple hover:text-white hover:bg-secondary-purple text-xl") +
                        " rounded-xl px-8 h-9"
                    }
                >
                    Weekly
                </Button>
                <Button
                    onClick={() => setActive("all-time")}
                    variant={isAllTime ? "secondary" : "ghost"}
                    className={
                        (isAllTime
                            ? "text-white text-xl bg-secondary-purple border border-secondary-purple"
                            : "text-secondary-purple hover:text-white hover:bg-secondary-purple text-xl") +
                        " rounded-xl px-8 h-9"
                    }
                >
                    All Time
                </Button>
            </div>
        </div>
    );
}

