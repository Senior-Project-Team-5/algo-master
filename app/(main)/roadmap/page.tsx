import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";

const HomePage = () => {
    return ( 
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress 
                    activeCourse="Linked Lists"
                    points={8}
                />
            </StickyWrapper>
            <FeedWrapper>
                <Header title="Data Structures and Algorithms" />
            </FeedWrapper>
        </div>
     );
}

export default HomePage;