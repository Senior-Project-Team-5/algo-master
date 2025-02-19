import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

type Props = {
    activeCourse: string; // TODO: replace with DB types
    points: number;
}

export const UserProgress = ({ activeCourse, points }: Props) => {
    return (
        <div className="flex items-center justify-between gap-x-2 w-full">
            <Link href={"/home"}>
                <Button variant={"secondaryOutline"}>
                    Continue Solving {activeCourse}
                </Button>
            </Link>
            <Button variant={"ghost"} className="text-green-500">
                <Image src={"/points.svg"} height={28} width={28} alt="points" className="mr-2" />
                {points}/10
            </Button>
        </div>
    )
}