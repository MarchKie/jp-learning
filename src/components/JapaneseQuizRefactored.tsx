'use client';

import React from 'react';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { useKeyboardHandling } from '@/hooks/useKeyboardHandling';
import { checkAnswerCorrectness, generateFeedback, calculateAccuracy } from '@/utils/quizUtils';
import { QuizSettings } from './quiz/QuizSettings';
import { QuizProgress } from './quiz/QuizProgress';
import { QuizStats } from './quiz/QuizStats';
import { hiraganaData, katakanaData } from '@/data/kanaData';

export default function JapaneseQuizRefactored() {
  const quiz = useQuizLogic();

  // Helper function to get romaji reading for kana characters
  const getKanaReading = (character: string, quizType: string) => {
    if (quizType === 'hiragana') {
      const kana = hiraganaData.find(k => k.character === character);
      return kana?.romaji;
    } else if (quizType === 'katakana') {
      const kana = katakanaData.find(k => k.character === character);
      return kana?.romaji;
    }
    return null;
  };

  // Helper function to convert kana reading to romaji
  const convertKanaToRomaji = (reading: string) => {
    let romaji = reading;
    
    // Combine all kana data and sort by character length (longest first)
    const allKana = [...hiraganaData, ...katakanaData].sort((a, b) => b.character.length - a.character.length);
    
    // Convert kana to romaji (process longer combinations first)
    allKana.forEach(kana => {
      romaji = romaji.replace(new RegExp(kana.character, 'g'), kana.romaji);
    });
    
    // Clean up any remaining dots and formatting
    romaji = romaji.replace(/\./g, '');
    
    return romaji;
  };

  // Answer checking logic
  const checkAnswer = () => {
    if (!quiz.currentQuestion || !quiz.userAnswer.trim()) return;

    const isCorrect = checkAnswerCorrectness(
      quiz.userAnswer,
      quiz.currentQuestion.answer,
      quiz.quizType,
      quiz.quizMode
    );

    const feedback = generateFeedback(
      isCorrect,
      quiz.currentQuestion,
      quiz.quizType,
      quiz.quizMode
    );

    quiz.setFeedback(feedback);
    quiz.updateStats(isCorrect);
    quiz.setShowAnswer(true);
  };

  // Next question logic
  const nextQuestion = () => {
    quiz.setShowAnswer(false);
    quiz.setUserAnswer('');
    quiz.generateQuestion();
  };

  // Restart quiz logic
  const restartQuiz = async () => {
    quiz.resetStats();
    quiz.resetQuiz();
    await quiz.initializeCharacters();
    quiz.generateQuestion();
  };

  // Keyboard handling
  const { inputRef, handleKeyDown } = useKeyboardHandling({
    currentQuestion: quiz.currentQuestion,
    showAnswer: quiz.showAnswer,
    userAnswer: quiz.userAnswer,
    onCheckAnswer: checkAnswer,
    onNextQuestion: nextQuestion,
  });

  const accuracy = calculateAccuracy(quiz.stats.correct, quiz.stats.total);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-lg border-b border-base-300">
        <div className="navbar-start">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            🎌 <span>JP Learning</span>
          </h1>
        </div>
        <div className="navbar-end">
          <div className="text-sm text-base-content/70">
            Score: {quiz.stats.correct}/{quiz.stats.total}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Settings & Progress */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quiz Settings */}
            <QuizSettings
              quizType={quiz.quizType}
              quizMode={quiz.quizMode}
              jlptLevel={quiz.jlptLevel}
              kanjiGrade={quiz.kanjiGrade}
              onQuizTypeChange={quiz.setQuizType}
              onQuizModeChange={quiz.setQuizMode}
              onJlptLevelChange={quiz.setJlptLevel}
              onKanjiGradeChange={quiz.setKanjiGrade}
            />

            {/* Progress */}
            <QuizProgress
              quizType={quiz.quizType}
              quizMode={quiz.quizMode}
              jlptLevel={quiz.jlptLevel}
              kanjiGrade={quiz.kanjiGrade}
              usedCharacters={quiz.usedCharacters}
              availableCharacters={quiz.availableCharacters}
            />
          </div>

          {/* Center - Main Quiz Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats */}
            <QuizStats stats={quiz.stats} onResetStats={quiz.resetStats} />

            {/* Quiz Area */}
            <div className="card bg-base-100 shadow-2xl border border-base-300 min-h-[600px]">
              <div className="card-body p-8 flex items-center justify-center">
                <div className="w-full max-w-2xl text-center">
                {quiz.isCompleted ? (
                  <div className="space-y-8">
                    <div className="text-8xl mb-8 animate-bounce">🎉</div>
                    <div className="space-y-4">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Quiz Completed!
                      </h2>
                      <p className="text-xl text-gray-600 leading-relaxed">
                        Congratulations! You've mastered all {quiz.availableCharacters.length} characters in this {quiz.quizType} set!
                      </p>
                    </div>
                    
                    <div className="card bg-success/10 border border-success/20 shadow-lg">
                      <div className="card-body text-center">
                        <h3 className="card-title text-3xl text-success justify-center mb-2">Final Score</h3>
                        <div className="text-xl text-success/80">
                          {quiz.stats.correct} correct out of {quiz.stats.total} questions
                        </div>
                        <div className="text-lg text-success/70 mt-2">
                          {accuracy}% accuracy - {accuracy >= 90 ? 'Outstanding!' : accuracy >= 70 ? 'Great job!' : 'Keep practicing!'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <button
                        onClick={restartQuiz}
                        className="btn btn-primary btn-lg text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        🚀 Start New Quiz
                      </button>
                      <div className="text-sm text-gray-500">
                        Progress: {quiz.usedCharacters.length}/{quiz.availableCharacters.length} characters mastered
                      </div>
                    </div>
                  </div>
                ) : quiz.isLoading ? (
                  <div className="space-y-6">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-xl text-base-content/70">Loading your next challenge...</p>
                  </div>
                ) : quiz.currentQuestion ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative group">
                        <div className={`text-8xl font-black mb-4 p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-105 ${
                          quiz.quizType === 'kanji' 
                            ? 'bg-error/10 border-2 border-error/20 text-error hover:bg-error/20' 
                            : quiz.quizType === 'hiragana'
                            ? 'bg-info/10 border-2 border-info/20 text-info hover:bg-info/20'
                            : 'bg-success/10 border-2 border-success/20 text-success hover:bg-success/20'
                        }`}>
                          {quiz.currentQuestion.character}
                        </div>
                      </div>
                      
                      {quiz.quizType === 'kanji' && quiz.currentQuestion.reading && (
                        <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200 shadow-lg">
                          {quiz.quizMode === 'character-to-romaji' && (
                            <div className="text-center space-y-4">
                              <div className="flex items-center justify-center space-x-2">
                                <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-xs">📖</span>
                                <div className="text-base font-bold text-blue-800">Kanji Readings</div>
                              </div>
                              
                              {/* Main reading display */}
                              <div className="bg-white/80 p-3 rounded-lg border border-blue-300 shadow-inner">                               
                                {/* All Name Readings */}
                                {quiz.currentQuestion.name_readings && quiz.currentQuestion.name_readings.length > 0 && (
                                  <div className="mb-3">
                                    <div className="text-xs font-semibold text-green-700 mb-1 flex items-center">
                                      <span className="w-4 h-4 bg-green-100 rounded mr-1 flex items-center justify-center text-xs">名</span>
                                      Name Readings ({quiz.currentQuestion.name_readings.length})
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {quiz.currentQuestion.name_readings.slice(0, 12).map((reading: string, index: number) => (
                                        <div 
                                          key={index}
                                          className="inline-flex flex-col items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded border border-green-300"
                                        >
                                          <span className="font-bold">{reading}</span>
                                          <span className="text-xs text-green-600 font-normal">({convertKanaToRomaji(reading)})</span>
                                        </div>
                                      ))}
                                      {quiz.currentQuestion.name_readings.length > 12 && (
                                        <span className="inline-flex items-center px-2 py-1 bg-green-200 text-green-700 text-xs font-bold rounded border border-green-300">
                                          +{quiz.currentQuestion.name_readings.length - 12}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                {/* All On Readings */}
                                {quiz.currentQuestion.on_readings && quiz.currentQuestion.on_readings.length > 0 && (
                                  <div className="mb-3">
                                    <div className="text-xs font-semibold text-red-700 mb-1 flex items-center">
                                      <span className="w-4 h-4 bg-red-100 rounded mr-1 flex items-center justify-center text-xs">音</span>
                                      On Readings ({quiz.currentQuestion.on_readings.length})
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {quiz.currentQuestion.on_readings.map((reading: string, index: number) => (
                                        <div 
                                          key={index}
                                          className="inline-flex flex-col items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded border border-red-300"
                                        >
                                          <span className="font-bold">{reading}</span>
                                          <span className="text-xs text-red-600 font-normal">({convertKanaToRomaji(reading)})</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* All Kun Readings */}
                                {quiz.currentQuestion.kun_readings && quiz.currentQuestion.kun_readings.length > 0 && (
                                  <div>
                                    <div className="text-xs font-semibold text-orange-700 mb-1 flex items-center">
                                      <span className="w-4 h-4 bg-orange-100 rounded mr-1 flex items-center justify-center text-xs">訓</span>
                                      Kun Readings ({quiz.currentQuestion.kun_readings.length})
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {quiz.currentQuestion.kun_readings.slice(0, 12).map((reading: string, index: number) => (
                                        <div 
                                          key={index}
                                          className="inline-flex flex-col items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded border border-orange-300"
                                        >
                                          <span className="font-bold">{reading}</span>
                                          <span className="text-xs text-orange-600 font-normal">({convertKanaToRomaji(reading)})</span>
                                        </div>
                                      ))}
                                      {quiz.currentQuestion.kun_readings.length > 12 && (
                                        <span className="inline-flex items-center px-2 py-1 bg-orange-200 text-orange-700 text-xs font-bold rounded border border-orange-300">
                                          +{quiz.currentQuestion.kun_readings.length - 12}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>                    
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-lg text-base-content/70 mb-4">
                        What is the <span className="font-semibold text-primary">
                          {quiz.quizMode === 'character-to-romaji' 
                            ? (quiz.quizType === 'kanji' ? 'meaning' : 'romaji') 
                            : 'character'}
                        </span> for this?
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={quiz.userAnswer}
                          onChange={(e) => quiz.setUserAnswer(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Type your answer..."
                          className="text-base-content input input-bordered input-lg text-2xl text-center w-full max-w-md mx-auto block shadow-lg focus:shadow-xl transition-all"
                          disabled={quiz.showAnswer}
                          autoFocus
                        />
                      </div>

                      {quiz.feedback && (
                        <div className={`alert max-w-md mx-auto ${
                          quiz.feedback.includes('✅') 
                            ? 'alert-success' 
                            : 'alert-error'
                        }`}>
                          <span>{quiz.feedback}</span>
                        </div>
                      )}

                      <div className="flex justify-center">
                        {!quiz.showAnswer ? (
                          <button
                            onClick={checkAnswer}
                            disabled={!quiz.userAnswer.trim()}
                            className="rounded btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                          >
                            ✨ Check Answer
                          </button>
                        ) : (
                          <button
                            onClick={nextQuestion}
                            className="rounded btn btn-success btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                          >
                            🚀 Next Question
                          </button>
                        )}
                      </div>

                      <div className="text-xs text-base-content/50">
                        💡 Press <kbd className="kbd kbd-sm">Enter</kbd> to {quiz.showAnswer ? 'continue' : 'submit'}
                      </div>
                    </div>
                  </div>
                ) : quiz.availableCharacters.length > 0 ? (
                  <div className="space-y-6">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-xl text-gray-600">Preparing your question...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-6xl mb-4">🎌</div>
                    <p className="text-xl text-gray-600">Ready to start your Japanese learning journey?</p>
                    <p className="text-gray-500">Configure your quiz settings and begin!</p>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
