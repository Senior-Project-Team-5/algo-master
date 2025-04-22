interface Topic {
  topic: string;
}

const Prequiz: React.FC<Topic> = ({ topic }) => {
  return (
    <div>
      <h3>{decodeURIComponent(topic)}</h3>

      <p>
        <br />
        <br />
        The quiz will end once you have reached 10 points. Each correct answer gives you +1 point, while incorrect answers result in -1 point. Your score will always be between 0 and 10.
      </p>
      <p>
        <br />
        Good Luck!
      </p>
    </div>
  );
};

export default Prequiz;
