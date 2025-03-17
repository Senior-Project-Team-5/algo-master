import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "./sidebar-item";
import { SignOutButton } from "./sign-out-button";
import { UserButton } from "@clerk/nextjs";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "h-full lg:w-[256px] lg:fixed flex left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href={"/home"}>
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/logo.png" height={600} width={600} alt="Logo" />
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label="Roadmap" href="/roadmap" iconSrc="roadmap.svg" />
        <SidebarItem
          label="Timed Mode"
          href="timed-mode"
          iconSrc="timed-mode.svg"
        />
        <SidebarItem
          label="Infinite Mode"
          href="infinite-mode"
          iconSrc="infinite-mode.svg"
        />
        <SidebarItem
          label="Leaderboard"
          href="/leaderboard"
          iconSrc="/trophy.svg"
        />
        <SidebarItem
          label="Achievements"
          href="/achievements"
          iconSrc="/achievements.svg"
        />
        <SidebarItem label="History" href="/history" iconSrc="/history.svg" />
        <SidebarItem label="Profile" href="/profile" iconSrc="/profile.svg" />
        <SignOutButton label="Sign Out" iconSrc="/sign-out.svg" />
      </div>
      <div className="p-3">
        <UserButton />
      </div>
    </div>
  );
};
