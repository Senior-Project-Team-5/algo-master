import { redirect } from 'next/navigation';
import { getCachedUserId, getUserProgress, getTopicName, getOneUserProgress} from '@/db/queries';
import db from '@/db';
import { userProgressTable } from '@/db/schema';
import QuizClient from './components/QuizClient';

export default async function TopicPage({ params }: { params: { topic: string } }) {
    const userId = await getCachedUserId();
    const { topic } = await params;
    const decodedTopic = decodeURIComponent(topic);
    
    // Get topic section and user progress
    const topicSection = await getTopicName(decodedTopic);
    console.log(topicSection)
    const userProgress = await getUserProgress();

    if (!userId || !topicSection || !userProgress) {
        redirect("/roadmap");
    }

    // If there's a prerequisite, check if it's completed
    if (topicSection.prerequisite_id) {
        const prerequisiteCompleted = userProgress.some(
            progress => progress.topic_section === topicSection.prerequisite_id && progress.completed
        );

        if (!prerequisiteCompleted) {
            redirect("/roadmap");
        }
    }

    // check if the user is in-progress for this current topic quiz, 
    // fetch the user progress data for this quiz section
    const quizProgress = await getOneUserProgress(topicSection.section_id);
    const topicID = topicSection.section_id
    console.log(topicID)
    console.log(topicID)

    // Default points to 0
    let initialPoints = 0;
    
    // if the user has not started the quiz, create a new user progress entry
    if (!quizProgress) {
        await db.insert(userProgressTable).values({
            userID: userId,
            topic_section: topicSection.section_id,
            completed: false,
            points: 0
        });
        console.log("New user progress entry created for quiz section", topicSection.section_id);
    } else {
        // If user has existing progress, get their points
        initialPoints = quizProgress.points;
        console.log("User has existing progress with points:", initialPoints);
    }

    // Pass both topicID and initialPoints to QuizClient
    return <QuizClient 
        topicParam={topic} 
        topicID={topicID} 
        initialPoints={initialPoints}
    />;
}
