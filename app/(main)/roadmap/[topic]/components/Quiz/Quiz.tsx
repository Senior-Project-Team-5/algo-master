import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

interface QuizItem {
    question: string;
    choices: string[];
    answer: string;
    explanation: string;
  }
  
interface Questions{
    quiz: QuizItem[]
}

const Quiz : React.FC<Questions> = ({quiz}) => {
    const [questionNumber, setQuestionNumber] = useState(0);
    const [question, setQuestion] = useState(quiz[0].question);
    const [choices, setChoices] = useState(quiz[0].choices);
    const [answer, setAnswer] = useState(quiz[0].answer);
    const [explanation, setExplanation] = useState(quiz[0].explanation);

    const nextQuestion = () =>{
        setQuestionNumber(questionNumber + 1)
        setQuestion(quiz[questionNumber].question)
        setChoices(quiz[questionNumber].choices)
        setAnswer(quiz[questionNumber].answer)
        setExplanation(quiz[questionNumber].explanation)
    }
    return ( 
        <div>
            <h3>{question}</h3>
            <ul>
                {choices.map((choice, index) =>(
                    <li key={index}>
                        <p>{String.fromCharCode(65+index)}. {choice}</p>
                    </li>

                ))}
            </ul>
            <p>Correct Answer: {answer}</p>
            <p>Explanation: {explanation}</p>

            
            <Button variant="primary" onClick={nextQuestion}>Next </Button>
            
        </div>
     );
}
 
export default Quiz;