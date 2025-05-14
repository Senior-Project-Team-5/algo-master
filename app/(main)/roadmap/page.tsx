import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { Unit } from "./components/unit";
import ProgressBar from "./components/ProgressBar";
import { Separator } from "@/components/ui/seperator";
import LeaderboardSnip from "./components/LeaderboardSnip";
import LanguageSelector from "./components/LanguageSelector";
import WelcomeBanner from "./components/welcomeBanner";


import 'bootstrap/dist/css/bootstrap.css';
import "../../globals.css";



// hard coded topic sections
const topicSections = [
    {
        id: 1,
        topic_name: "Arrays & Strings",
    },
    {
        id: 2,
        topic_name: "Hashmaps & Sets",
    },
    {
        id: 3,
        topic_name: "Stacks & Queues",
    },
    {
        id: 4,
        topic_name: "Linked Lists",
    },
    {
        id: 5,
        topic_name: "Binary Search",
    },
    {
        id: 6,
        topic_name: "Sliding Window",
    },
    {
        id: 7,
        topic_name: "Trees",
    },
    {
        id: 8,
        topic_name: "Heaps",
    },
    {
        id: 9,
        topic_name: "Backtracking",
    },
    {
        id: 10,
        topic_name: "Graphs",
    },
    {
        id: 11,
        topic_name: "Dynamic Programming",
    }
]

const HomePage = async () => {

    return ( 
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                {/*<UserProgress 
                    activeCourse="Linked Lists"
                    points={8}
                />*/}
                <WelcomeBanner/>

                <div className="progress-sub">
                    <p className="font-bold text-progress">Your Progress</p>
                    <ProgressBar />
                </div>
                <div className="leaderboard-sub">
                    <LeaderboardSnip/>
                </div>

                <div className="language-sub">
                    <LanguageSelector />
                </div>
            </StickyWrapper>

            <FeedWrapper>
                <Header title="Data Structures and Algorithms" />
                {topicSections?.map((topicSection) => (
                    <Unit key={topicSection.id} id={topicSection.id} topic_name={topicSection.topic_name} />
                ))}
            </FeedWrapper>
        </div>
     );
}

export default HomePage;
