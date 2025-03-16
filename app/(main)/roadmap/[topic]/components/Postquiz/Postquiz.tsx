import Link from "next/link";

const Postquiz = () => {
  return (
    <div className="postquiz-container">
      <h1>
        Congratulations! You've completed the quiz
      </h1>
      <p>You've reached the goal of 10 points.</p>
      
      <Link href={`/roadmap`} className="return-link">
        Return to Roadmap
      </Link>
    </div>
  );
};

export default Postquiz;
