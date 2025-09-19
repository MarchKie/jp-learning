import { useEffect, useRef } from 'react';
import { QuizItem } from './useQuizState';

interface UseKeyboardHandlingProps {
  currentQuestion: QuizItem | null;
  showAnswer: boolean;
  userAnswer: string;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
}

export const useKeyboardHandling = ({
  currentQuestion,
  showAnswer,
  userAnswer,
  onCheckAnswer,
  onNextQuestion,
}: UseKeyboardHandlingProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showAnswer) {
        onNextQuestion();
      } else {
        onCheckAnswer();
      }
    }
  };

  // Global keydown listener for Enter key
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && currentQuestion) {
        e.preventDefault();
        if (showAnswer) {
          onNextQuestion();
        } else if (userAnswer.trim()) {
          onCheckAnswer();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [showAnswer, userAnswer, currentQuestion, onCheckAnswer, onNextQuestion]);

  // Focus input when component mounts or when a new question is generated
  useEffect(() => {
    if (currentQuestion && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [currentQuestion]);

  return {
    inputRef,
    handleKeyDown,
  };
};
