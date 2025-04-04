"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

type Task = {
  date: string;
  mode: string;
  section_id: string;
  section_name: string;
  duration: string;
  progress: string;
  questions: string[];
};

export default function Dashboard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const tasks: Task[] = [
    { date: "1/2/25", mode: "Timed", section_id: "1.1", section_name: "Introduction to Strings & Arrays", duration: "15 mins", progress: "15 questions", questions: [
      "What is a string in programming?",
      "How do you declare an array in JavaScript?",
      "What is the difference between an array and a linked list?",
    ], },
    { date: "1/2/25", mode: "Infinite", section_id: "1.3", section_name: "Array & String Coding Algorithms", duration: "1 hr", progress: "32 questions", questions: [
      "What is a string in programming?",
      "How do you declare an array in JavaScript?",
      "What is the difference between an array and a linked list?",
    ], },
    { date: "1/2/25", mode: "Infinite", section_id: "1.3", section_name: "Array & String Coding Algorithms", duration: "18 mins", progress: "12 questions", questions: [
      "What is a string in programming?",
      "How do you declare an array in JavaScript?",
      "What is the difference between an array and a linked list?",
    ], },
    { date: "1/2/25", mode: "Infinite", section_id: "1.3", section_name: "Array & String Coding Algorithms", duration: "20 mins", progress: "12 questions", questions: [
      "What is a string in programming?",
      "How do you declare an array in JavaScript?",
      "What is the difference between an array and a linked list?",
    ], },
    { date: "1/2/25", mode: "Timed", section_id: "1.2", section_name: "Array & String Manipulation", duration: "15 mins", progress: "12 questions", questions: [
      "What is a string in programming?",
      "How do you declare an array in JavaScript?",
      "What is the difference between an array and a linked list?",
    ], },
    { date: "1/2/25", mode: "Timed", section_id: "1.2", section_name: "Array & String Manipulation", duration: "15 mins", progress: "18 questions", questions: [
      "What is a string in programming?",
      "How do you declare an array in JavaScript?",
      "What is the difference between an array and a linked list?",
    ], },
    { date: "1/2/25", mode: "Infinite", section_id: "1.3", section_name: "Array & String Coding Algorithms", duration: "30 mins", progress: "25 questions", questions: [
      "What is a string in programming?",
      "How do you declare an array in JavaScript?",
      "What is the difference between an array and a linked list?",
    ], },
    { date: "1/2/25", mode: "Infinite", section_id: "1.3", section_name: "Array & String Coding Algorithms", duration: "40 mins", progress: "27 questions", questions: [
      "What is a string in programming?",
      "How do you declare an array in JavaScript?",
      "What is the difference between an array and a linked list?",
    ], },
  ];

  function openModal(task: Task) {
    setSelectedTask(task);
    setIsOpen(true);
  }

  return (
    <div className="flex flex-col md:flex-row p-6 bg-white min-h-screen">
      <div className="flex-1 p-6">
        <h1 className="text-3xl text-[#2E588D] font-extrabold mb-4">Attempt History</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Date</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Mode</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Topic Number</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Topic</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Duration</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Questions Completed</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">More</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{task.date}</td>
                  <td className="px-6 py-4 font-mono text-gray-700">{task.mode}</td>
                  <td className="px-6 py-4 text-gray-700">{task.section_id}</td>
                  <td className="px-6 py-4 text-gray-700">{task.section_name}</td>
                  <td className="px-6 py-4 text-gray-700">{task.duration}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-white bg-[#BA6532] rounded-full">{task.progress}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openModal(task)} className="text-gray-500 hover:text-blue-600">
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Animated Modal - prolly use similar thing for achievements (a pop up) */}
      <Transition appear show={isOpen} as={motion.div} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
              <Dialog.Title className="text-xl font-bold text-[#2E588D]">Attempt Details</Dialog.Title>
              <p className="text-gray-600 mt-2">Mode: {selectedTask?.mode}</p>
              <p className="text-gray-600">Topic: {selectedTask?.section_name}</p>
              <p className="text-gray-600">Duration: {selectedTask?.duration}</p>
              <p className="text-gray-600">Questions Completed: {selectedTask?.progress}</p>

              {/* List of Completed Questions - different when integrated
                  i think i will have some UI to change once integrated with backend, just dont know what form data is extracted in from db - choezom */}
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-[#2E588D]">Completed Questions:</h2>
                <ul className="list-disc list-inside text-gray-600 mt-2">
                  {selectedTask?.questions.map((question, index) => (
                    <li key={index} className="mt-1">{question}</li>
                  ))}
                </ul>
              </div>

              <button onClick={() => setIsOpen(false)} className="mt-4 px-4 py-2 bg-[#BA6532] text-white rounded-md hover:bg-[#914d2b]">
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
