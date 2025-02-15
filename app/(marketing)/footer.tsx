import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
            Footer
            <Link href="./home">
                <Button size={"lg"} variant={"ghost"}>
                    Trial
                </Button>
            </Link> 
        </footer>
    )
}