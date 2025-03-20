interface Topic {
  topic: string;
}

const Prequiz: React.FC<Topic> = ({ topic }) => {
  return (
    <div>
      <h3>{decodeURIComponent(topic)}</h3>
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
        The quiz will end once you have reached 10 points. Each correct answer gives you +1 point, while incorrect answers result in -1 point. Your score will always be between 0 and 10.
      </p>
      <p>
        You can end the quiz anytime, but you will lose your progress.
      </p>
      <p>
        <br />
        Good Luck!
      </p>
    </div>
  );
};

export default Prequiz;
