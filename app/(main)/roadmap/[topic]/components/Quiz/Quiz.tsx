import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

interface QuizItem {
    question_no_code: string;
    choices: string[];
    answer: string;
    resources: string;
  }
  
interface Questions{
    quiz: QuizItem[]
}

const Quiz : React.FC<Questions> = ({quiz}) => {
    const [questionNumber, setQuestionNumber] = useState(0);
    const [question, setQuestion] = useState(quiz[0].question_no_code);
    const [choices, setChoices] = useState(quiz[0].choices);
    const [answer, setAnswer] = useState(quiz[0].answer);
    const [resources, setResources] = useState(quiz[0].resources);

    const nextQuestion = () =>{
        setQuestionNumber(questionNumber + 1)
        setQuestion(quiz[questionNumber].question_no_code)
        setChoices(quiz[questionNumber].choices)
        setAnswer(quiz[questionNumber].answer)
        setResources(quiz[questionNumber].resources)
    }
    return ( 
        <div>
            <h3>{question}</h3>
            <p>Correct Answer: {answer}</p>

            
            <Button variant="primary" onClick={nextQuestion}>Next </Button>
            
        </div>
     );
}
 
export default Quiz;