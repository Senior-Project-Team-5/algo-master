import Link from "next/link";

const Postquiz = () => {
  return (
    <div>
      <h1>
        You've completed the quiz
      </h1>
      
      <Link href={`/roadmap`}>
        Return to Roadmap
      </Link>
    </div>
  );
};

export default Postquiz;
