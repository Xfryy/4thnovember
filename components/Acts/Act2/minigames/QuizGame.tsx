"use client";

import React, { useState, useEffect } from "react";
import { MinigameProps } from "@/components/Acts/BaseActConfig";

const quiz_questions = [
  {
    question: "What does Rinn say about time?",
    options: ["Time is a construct", "Even if time resets", "Time is real", "Time doesn't exist"],
    correct: 1,
  },
  {
    question: "How does the protagonist feel about Rinn?",
    options: ["Uncertainty", "Trust", "Fear", "Confusion"],
    correct: 0,
  },
  {
    question: "What hint about the world's nature does Rinn give?",
    options: ["It's a dream", "It resets repeatedly", "It's digital", "It's haunted"],
    correct: 1,
  },
  {
    question: "What is the protagonist trying to remember?",
    options: ["Their name", "Why they're here", "Rinn's true nature", "Their past"],
    correct: 1,
  },
];

export function QuizGame({ title, onResult, audio }: MinigameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    if (audio?.bgm) {
      const bgmAudio = new Audio(audio.bgm);
      bgmAudio.loop = true;
      bgmAudio.play().catch(() => {});
      return () => {
        bgmAudio.pause();
      };
    }
    return undefined;
  }, [audio]);

  const handleAnswer = (index: number) => {
    if (answered) return;

    setSelectedOption(index);
    setAnswered(true);

    if (index === quiz_questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quiz_questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswered(false);
        setSelectedOption(null);
      } else {
        // Quiz complete
        const passed = score + (index === quiz_questions[currentQuestion].correct ? 1 : 0) >= quiz_questions.length / 2;
        onResult(passed ? "win" : "lose", { score: score + (index === quiz_questions[currentQuestion].correct ? 1 : 0), total: quiz_questions.length });
      }
    }, 1000);
  };

  const question = quiz_questions[currentQuestion];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: "40px",
        background: "linear-gradient(135deg, rgba(20,20,40,0.9), rgba(15,15,30,0.95))",
      }}
    >
      <h2
        style={{
          fontSize: "1.8rem",
          fontWeight: 600,
          letterSpacing: "0.5px",
          color: "#ffffff",
          textAlign: "center",
          margin: 0,
        }}
      >
        {title || "Truth Challenge"}
      </h2>

      <div
        style={{
          fontSize: "0.85rem",
          letterSpacing: "0.3em",
          color: "rgba(236,72,153,0.7)",
          textTransform: "uppercase",
        }}
      >
        Question {currentQuestion + 1} of {quiz_questions.length}
      </div>

      <p
        style={{
          fontSize: "1.3rem",
          fontWeight: 500,
          color: "#ffffff",
          textAlign: "center",
          maxWidth: "600px",
          lineHeight: 1.6,
          margin: 0,
          letterSpacing: "0.2px",
        }}
      >
        {question.question}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={answered}
            style={{
              padding: "16px 24px",
              backgroundColor:
                selectedOption === index
                  ? index === question.correct
                    ? "rgba(74,222,128,0.8)"
                    : "rgba(248,113,113,0.8)"
                  : "rgba(255,255,255,0.05)",
              border: selectedOption === index ? "2px solid" : "1px solid",
              borderColor:
                selectedOption === index ? (index === question.correct ? "#4ade80" : "#f87171") : "rgba(255,255,255,0.2)",
              borderRadius: "8px",
              color: "#ffffff",
              cursor: answered ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              fontSize: "0.95rem",
              fontWeight: 500,
              letterSpacing: "0.2px",
              opacity: answered ? 0.7 : 1,
              transform: selectedOption === index ? "scale(1.02)" : "scale(1)",
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.15px",
        }}
      >
        Current Score: {score} / {quiz_questions.length}
      </div>

      <button
        onClick={() => onResult("quit")}
        style={{
          marginTop: 24,
          padding: "10px 24px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.6)",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "0.85rem",
          fontWeight: 500,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)";
          (e.target as HTMLButtonElement).style.color = "#ffffff";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
          (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)";
        }}
      >
        Give Up
      </button>
    </div>
  );
}

export default QuizGame;
