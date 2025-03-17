import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import "./page.css";

export default function Home() {
  return (
    <div id="home">
      <div id="home-left">
        <div id="home-left-info">
          <Image src="/logo.svg" height={500} width={500} alt="Logo" />
          <h1 id="home-left-info-title">
            Test Your Data Structures & Algorithms Knowledge With Us
          </h1>
          <h1 id="home-left-info-subtitle">Join Us Now</h1>
        </div>
        <div id="home-left-clerk">
          <ClerkLoading>
            <p className="text-green-400">Loading...</p>
          </ClerkLoading>
          <ClerkLoaded>
            <SignedOut>
              <SignUpButton mode="modal" fallbackRedirectUrl={"/roadmap"}>
                <Button variant={"secondary"} size={"lg"}>
                  Get Started
                </Button>
              </SignUpButton>
              <SignInButton mode="modal" fallbackRedirectUrl={"/roadmap"}>
                <Button variant={"secondaryOutline"} size={"lg"}>
                  Already have an account? Sign in here
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button
                variant={"primary"}
                size={"lg"}
                className="w-full"
                asChild
              >
                <Link href="/roadmap">Continue Learning</Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>

      <div id="home-image">
        <Image
          src="/coding picture.svg"
          alt="coding image"
          fill
          objectFit="cover"
        />
      </div>
    </div>
  );
}
