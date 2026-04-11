"use client";
import { useState, useEffect } from "react";
import CPCard from "./CPCard";
import AskQuestion from "./AskQuestion";
import { getRandomQuestions } from "@/lib/api";
import type { Question, AnswerIn } from "@/types";

interface StepQuestionsProps {
  answers: AnswerIn[];
  onAnswersChange: (answers: AnswerIn[]) => void;
  shownQuestionIds: number[];
  onShownIdsChange: (ids: number[]) => void;
  answerMediaFiles: Record<number, File[]>;
  onAnswerMediaChange: (mediaFiles: Record<number, File[]>) => void;
}

const TOTAL_QUESTIONS = 15;

export default function StepQuestions({
  answers,
  onAnswersChange,
  shownQuestionIds,
  onShownIdsChange,
  answerMediaFiles,
  onAnswerMediaChange,
}: StepQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [allShown, setAllShown] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (questions.length === 0) loadMore(5);
  }, []);

  async function loadMore(count = 1) {
    setLoading(true);
    setError(false);
    try {
      const newQs = await getRandomQuestions(count, shownQuestionIds);
      const updatedIds = [...shownQuestionIds, ...newQs.map((q) => q.id)];
      setQuestions((prev) => [...prev, ...newQs]);
      onShownIdsChange(updatedIds);
      if (updatedIds.length >= TOTAL_QUESTIONS) setAllShown(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(questionId: number, text: string) {
    const existing = answers.find((a) => a.question_id === questionId);
    if (existing) {
      onAnswersChange(answers.map((a) => a.question_id === questionId ? { ...a, answer_text: text } : a));
    } else {
      onAnswersChange([...answers, { question_id: questionId, answer_text: text }]);
    }
  }

  function handleClear(questionId: number) {
    onAnswersChange(answers.filter((a) => a.question_id !== questionId));
  }

  function handleFilesChange(questionId: number, files: File[]) {
    onAnswerMediaChange({ ...answerMediaFiles, [questionId]: files });
  }

  return (
    <CPCard step="02" title="cuéntale algo a jime">
      <p className="font-nunito text-sm text-blue-400 mb-4">respondé las que quieras — todo es opcional 💙</p>

      {error && (
        <div className="mb-3 p-3 bg-red-50 border-2 border-red-300 rounded-xl text-center">
          <p className="text-red-600 text-sm font-nunito mb-2">No se pudieron cargar las preguntas 😕</p>
          <button onClick={() => loadMore(5)} className="text-cp-dark-blue text-sm font-bold underline font-nunito">reintentar</button>
        </div>
      )}

      {questions.map((q) => (
        <AskQuestion
          key={q.id}
          question={q.text}
          value={answers.find((a) => a.question_id === q.id)?.answer_text ?? ""}
          onChange={(text) => handleAnswer(q.id, text)}
          onClear={() => handleClear(q.id)}
          files={answerMediaFiles[q.id] ?? []}
          onFilesChange={(files) => handleFilesChange(q.id, files)}
        />
      ))}

      {!allShown && (
        <button
          type="button"
          onClick={() => loadMore(1)}
          disabled={loading}
          className="w-full mt-2 py-4 border-[3px] border-cp-blue rounded-xl font-nunito font-bold text-base text-cp-dark-blue hover:bg-cp-sky transition-colors disabled:opacity-50"
        >
          {loading ? "cargando..." : "💬 ver otra pregunta"}
        </button>
      )}
    </CPCard>
  );
}
