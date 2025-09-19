import { QuizType, QuizMode, QuizItem } from '@/hooks/useQuizState';

export const checkAnswerCorrectness = (
  userInput: string,
  correctAnswer: string,
  quizType: QuizType,
  quizMode: QuizMode
): boolean => {
  const userAnswer = userInput.trim().toLowerCase();
  const answer = correctAnswer.toLowerCase();
  
  // Check for exact match first
  if (userAnswer === answer) return true;
  
  // For kanji meanings, check if user input matches any individual meaning
  if (quizType === 'kanji' && quizMode === 'character-to-romaji') {
    const meanings = answer.split(',').map(meaning => meaning.trim());
    return meanings.some(meaning => meaning === userAnswer);
  }
  
  return false;
};

export const generateFeedback = (
  isCorrect: boolean,
  currentQuestion: QuizItem,
  quizType: QuizType,
  quizMode: QuizMode
): string => {
  if (isCorrect) {
    let correctFeedback = '✅ Correct!';
    if (quizType === 'kanji' && currentQuestion.meaning && currentQuestion.reading) {
      if (quizMode === 'character-to-romaji') {
        correctFeedback += ` (Reading: ${currentQuestion.reading})`;
      } else if (quizMode === 'romaji-to-character') {
        correctFeedback += ` (Meaning: ${currentQuestion.meaning})`;
      } else if (quizMode === 'meaning-to-character') {
        correctFeedback += ` (Reading: ${currentQuestion.reading})`;
      }
    }
    return correctFeedback;
  } else {
    let incorrectFeedback = `❌ Incorrect. The answer is: ${currentQuestion.answer}`;
    if (quizType === 'kanji' && currentQuestion.meaning && currentQuestion.reading) {
      if (quizMode === 'character-to-romaji') {
        incorrectFeedback += ` (Reading: ${currentQuestion.reading})`;
      } else if (quizMode === 'romaji-to-character') {
        incorrectFeedback += ` (Meaning: ${currentQuestion.meaning})`;
      } else if (quizMode === 'meaning-to-character') {
        incorrectFeedback += ` (Reading: ${currentQuestion.reading})`;
      }
    }
    return incorrectFeedback;
  }
};

export const getQuizModeLabel = (quizMode: QuizMode, quizType: QuizType): string => {
  switch (quizMode) {
    case 'character-to-romaji':
      return quizType === 'kanji' ? 'Character → Meaning' : 'Character → Romaji';
    case 'romaji-to-character':
      return quizType === 'kanji' ? 'Reading → Character' : 'Romaji → Character';
    case 'meaning-to-character':
      return 'Meaning → Character';
    default:
      return '';
  }
};

export const calculateAccuracy = (correct: number, total: number): number => {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
};
