import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Topic {
  topic: string;
}

const Prequiz: React.FC<Topic> = ({ topic }) => {
  return (
    <div>
      <h3>{decodeURI(topic)}</h3>
      <h1>
        <br />
        Questions includes
      </h1>
      {/* Currently, the following prompts are hard coded, but later, it will be retrieved from the database */}
      <ul>
        <li>Fundamentals of arrays</li>
        <li>Identifying an array function</li>
        <li>Identifying the result of an array function</li>
      </ul>

      <p>
        <br />
        <br />
        The quiz will end once you have reached 10 point. You can end the quiz
        anytime, but you will lose your progress.
      </p>
      <p>
        <br />
        Good Luck!
      </p>
    </div>
  );
};

export default Prequiz;
