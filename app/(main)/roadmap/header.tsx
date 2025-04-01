import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
    title: string;
}

export const Header = ({ title }: Props) => {
    return (
        <div className="sticky top-0 bg-white pb-3 lg:pt-[28px] lg:mt-[-28px] flex justify-center items-center text-center border-b-2 mb-5 mx-auto text-neutral-400 lg:z-50 w-full">
            {/*<Link href="/home">
                <Button>
                    <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
                </Button>
            </Link>*/}
            <h1 className="font-bold text-lg">
                {title}
            </h1>
            <div />
        </div>
    )
}
