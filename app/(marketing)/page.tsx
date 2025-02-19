import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";


export default function Home() {
  return (
    <div>
      <h1 className="text-green-500 font-bold">
        Marketing Page
      </h1>
      <ClerkLoading>
        <p className="text-green-400">Loading...</p>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <SignUpButton mode="modal" fallbackRedirectUrl={"/home"}>
            <Button variant={"secondary"} size={"lg"} className="w-full">
              Get Started
            </Button>
          </SignUpButton>
          <SignInButton mode="modal" fallbackRedirectUrl={"/home"}>
            <Button variant={"secondaryOutline"} size={"lg"} className="w-full">
              Already have an account? Sign in here
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Button variant={"primary"} size={"lg"} className="w-full" asChild>
            <Link href="/home">
              Continue Learning
            </Link>
          </Button>
        </SignedIn>
      </ClerkLoaded>
    </div>
  )
}