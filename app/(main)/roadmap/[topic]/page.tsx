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

    // if the user has not started the quiz, create a new user progress entry
    if (!quizProgress) {
        await db.insert(userProgressTable).values({
            userID: userId,
            topic_section: topicSection.section_id,
            completed: false,
            points: 0
        });
        console.log("New user progress entry created for quiz section", topicSection.section_id);
    }

    return <QuizClient topicParam={topic} />;
}
