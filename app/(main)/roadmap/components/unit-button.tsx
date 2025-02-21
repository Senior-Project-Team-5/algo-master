"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Crown, Star, Clock3 } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import Link from "next/link";

type Props = {
    id: number;
    index: number;
    totalCount: number;
    topic_name: string;
    section_id: string;
    locked?: boolean;
    pointsEarned: number;
}

export const UnitButton = ({ id, index, totalCount, topic_name, section_id, locked, pointsEarned }: Props) => {
    const cycleLength = 8
    const cycleIndex = index % cycleLength

    let indentationLevel

    if (cycleIndex <= 2) {
        indentationLevel = cycleIndex
    }
    else if (cycleIndex <= 4) {
        indentationLevel = 4 - cycleIndex
    }
    else if (cycleIndex <= 6) {
        indentationLevel = 4 - cycleIndex
    }
    else {
        indentationLevel = cycleIndex - 8
    }

    const rightPosition = 40 * indentationLevel

    const isFirst = index === 0
    const isLast = index === totalCount - 1
    const isCompleted = !locked

    const percentage = pointsEarned / 10 * 100

    let Icon
    if (isCompleted && percentage === 100) {
        Icon = Check
    } else if (!locked && percentage < 100 && percentage > 0) {
        Icon = Clock3
    } else if (isLast) {
        Icon = Crown
    } else {
        Icon = Star
    }

    return (
        <div className={cn(
            "relative",
            isLast && "mb-20"
        )}
            style={{
                right: `${rightPosition}px`,
                marginTop: isFirst && !isCompleted ? 60 : 24,
            }}
        >
                <div className="h-[102px] w-[102px] relative">
                    <CircularProgressbarWithChildren
                        value={percentage}
                        styles={{
                            path: {
                                stroke: '#4ade80',
                            },
                            trail: {
                                stroke: '#e5e7eb',
                            },
                        }}
                    >
                        <div className="relative group">
                            <div className="absolute left-1/2 -top-14 -translate-x-1/2 px-3 py-2.5 border-2 font-bold text-green-500 bg-white rounded-xl tracking-wide z-20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {section_id} {topic_name}
                                {locked && <div className="text-sm font-normal text-red-500">Complete previous level(s) to unlock</div>}
                                <div className="absolute left-1/2 bottom-0 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2 translate-y-full" />
                            </div>
                            {locked ? (
                                <Button
                                    size={"rounded"} 
                                    variant="danger"
                                    className="h-[70px] w-[70px] border-b-8 cursor-not-allowed"
                                    disabled
                                >
                                    <Icon 
                                        className="h-10 w-10 fill-neutral-400 text-neutral-400 stroke-neutral-400"
                                    />
                                </Button>
                            ) : (
                                <Link href={`/quiz/${encodeURIComponent(topic_name)}`}>
                                    <Button
                                        size={"rounded"} 
                                        variant="secondary"
                                        className="h-[70px] w-[70px] border-b-8"
                                    >
                                        <Icon 
                                            className={cn(
                                                "h-10 w-10",
                                                "fill-primary-foreground text-primary-foreground",
                                                isCompleted && "fill-none stroke-[4]"
                                            )}
                                        />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CircularProgressbarWithChildren>
                </div>
        </div>
    );
};