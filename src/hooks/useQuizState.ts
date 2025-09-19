import { useState } from 'react';

export type QuizType = 'hiragana' | 'katakana' | 'kanji';
export type QuizMode = 'character-to-romaji' | 'romaji-to-character' | 'meaning-to-character';

export interface QuizItem {
  character: string;
  answer: string;
  type: QuizType;
  meaning?: string;
  reading?: string;
  name_readings?: string[];
  on_readings?: string[];
  kun_readings?: string[];
}

export interface QuizStats {
  correct: number;
  incorrect: number;
  total: number;
}

export const useQuizState = () => {
  const [quizType, setQuizType] = useState<QuizType>('hiragana');
  const [quizMode, setQuizMode] = useState<QuizMode>('character-to-romaji');
  const [currentQuestion, setCurrentQuestion] = useState<QuizItem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const [stats, setStats] = useState<QuizStats>({ correct: 0, incorrect: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [jlptLevel, setJlptLevel] = useState<number | undefined>(undefined);
  const [kanjiGrade, setKanjiGrade] = useState<number | undefined>(undefined);
  const [usedCharacters, setUsedCharacters] = useState<string[]>([]);
  const [availableCharacters, setAvailableCharacters] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const resetStats = () => {
    setStats({ correct: 0, incorrect: 0, total: 0 });
  };

  const updateStats = (isCorrect: boolean) => {
    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      total: prev.total + 1
    }));
  };

  const resetQuiz = () => {
    setUsedCharacters([]);
    setIsCompleted(false);
    setCurrentQuestion(null);
    setFeedback('');
    setShowAnswer(false);
    setUserAnswer('');
  };

  return {
    // State
    quizType,
    quizMode,
    currentQuestion,
    userAnswer,
    feedback,
    stats,
    isLoading,
    showAnswer,
    jlptLevel,
    kanjiGrade,
    usedCharacters,
    availableCharacters,
    isCompleted,
    
    // Setters
    setQuizType,
    setQuizMode,
    setCurrentQuestion,
    setUserAnswer,
    setFeedback,
    setIsLoading,
    setShowAnswer,
    setJlptLevel,
    setKanjiGrade,
    setUsedCharacters,
    setAvailableCharacters,
    setIsCompleted,
    
    // Actions
    resetStats,
    updateStats,
    resetQuiz,
  };
};
