import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { Unit } from "./components/unit";
// import { getTopics } from "@/db/queries";


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
    // const topics = await getTopics();

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
                {topicSections?.map((topicSection) => (
                    <Unit key={topicSection.id} id={topicSection.id} topic_name={topicSection.topic_name} />
                ))}
            </FeedWrapper>
        </div>
     );
}

export default HomePage;