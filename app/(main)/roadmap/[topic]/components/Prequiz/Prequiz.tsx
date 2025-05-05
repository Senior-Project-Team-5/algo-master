interface Topic {
  topic: string;
}

const Prequiz: React.FC<Topic> = ({ topic }) => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl text-[#2E588D] font-bold mb-6">{decodeURIComponent(topic)}</h1>
      <p>
        <br />
        <br />
        Each correct answer gives you +1 point, while incorrect answers result in -1 point.
        <br />
        <br />

        The quiz will end once you have reached 10 points. 
        <br />
        <br />

        Good Luck!
      </p>

    </div>
  );
};

export default Prequiz;
