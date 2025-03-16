import { getUserProgress, getTopicData } from "@/db/queries";
import { UnitBanner } from "./unit-banner";
import { UnitButton } from "./unit-button";
import { index } from "drizzle-orm/pg-core";

type Props = {
    id: number;
    topic_name: string;
    // section_id: string;
    // prerequisite_id: string | null;
    // points_required: number;
}

export const Unit = async ({ id, topic_name }: Props) => {
    const [userProgress, topicData] = await Promise.all([
        getUserProgress(),
        getTopicData(topic_name)
    ]);

    if (!userProgress || !topicData) return null;

    return (
        <>
            <UnitBanner title={topic_name} />
            <div className="flex items-center flex-col relative">
                {topicData.map((topic, index) => {
                    const prerequisiteProgress = topic.prerequisite_id 
                        ? userProgress.find(progress => 
                            progress.topic_section === topic.prerequisite_id && 
                            progress.completed
                          )
                        : true;

                    const currentProgress = userProgress.find(
                        progress => progress.topic_section === topic.section_id
                    );

                    const isLocked = !prerequisiteProgress;

                    return (
                        <UnitButton
                            index={index}
                            key={topic.id} 
                            id={topic.id}
                            totalCount={topicData.length}
                            topic_name={topic.section_name}
                            section_id={topic.section_id} 
                            locked={isLocked}
                            pointsEarned={currentProgress?.points ?? 0}
                        />
                    );
                })}
            </div>
        </>
    );
};