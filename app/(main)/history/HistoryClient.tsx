"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

type Attempt = {
  date_taken: string;
  mode: string;
  type: string;
  points: number;
  correct_answers: number;
  incorrect_answers: number;
  accuracy_percentage: number;
  topics_covered?: string[] | null;
  questions?: string[] | null;
};

export default function HistoryClient({ userModeHistory }: { userModeHistory: Attempt[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);

  const openModal = (attempt: Attempt) => {
    setSelectedAttempt(attempt);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedAttempt(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl text-[#2E588D] font-extrabold mb-4">Attempt History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Mode</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Points</th>
              <th className="px-6 py-3 text-left">Accuracy</th>
              <th className="px-6 py-3 text-left">Topics</th>
              <th className="px-6 py-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {userModeHistory.map((task, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{task.date_taken}</td>
                <td className="px-6 py-4">{task.mode}</td>
                <td className="px-6 py-4">{task.type}</td>
                <td className="px-6 py-4">{task.points}</td>
                <td className="px-6 py-4">{task.accuracy_percentage}%</td>
                <td className="px-6 py-4 text-xs">
                  <ul>
                    {task.topics_covered?.map((topic, idx) => (
                      <li key={idx}>{topic}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => openModal(task)}>
                    <ChevronRightIcon className="h-5 w-5 text-[#2E588D]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal (same as before) */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-[#bb6632]">Attempt Details</Dialog.Title>
                  <div className="mt-2 space-y-2 text-sm text-gray-700">
                    {selectedAttempt && (
                      <>
                        <p><strong>Date:</strong> {selectedAttempt.date_taken}</p>
                        <p><strong>Correct:</strong> {selectedAttempt.correct_answers}</p>
                        <p><strong>Incorrect:</strong> {selectedAttempt.incorrect_answers}</p>
                        <p><strong>Questions:</strong></p>
                        <ul className="list-disc ml-5">
                          {selectedAttempt.questions?.map((topic, idx) => (
                            <li key={idx}>{topic}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                  <div className="mt-4 text-right">
                    <button onClick={closeModal} className="rounded-md bg-[#bb6632] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e4570]">Close</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
