/*
    This page is a development page and is meant to be the roadmap.
    
    To connect to the roadmap, follow these steps:
    1) Change the url, specifically after /quizTEST so that it reflects the topic
    Ex: If the topic is Stacks, then the url is "/roadmap/stacks"
    2) Add `href="/roadmap/[topic]"' to the topic button in the roadmap or table of contents

*/

"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";

const quizTEST = () => {
    return ( 
        <div>
            <Link href="/quizTEST/array">
                <Button variant="primary">Array </Button>
            </Link>
            <Button variant={"primary"}>
                Linked Lists
            </Button>
        </div>
     );
}
 
export default quizTEST;