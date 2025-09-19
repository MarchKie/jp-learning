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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Sidebar - Settings & Progress */}
          <div className="xl:col-span-1 space-y-6">
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
          <div className="xl:col-span-3 space-y-6">
            {/* Stats */}
            <QuizStats stats={quiz.stats} onResetStats={quiz.resetStats} />

            {/* Quiz Area */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-8 text-center min-h-[600px] flex items-center justify-center">
              <div className="w-full max-w-2xl">
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
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                      <div className="text-3xl font-bold text-green-800 mb-2">Final Score</div>
                      <div className="text-xl text-green-700">
                        {quiz.stats.correct} correct out of {quiz.stats.total} questions
                      </div>
                      <div className="text-lg text-green-600 mt-2">
                        {accuracy}% accuracy - {accuracy >= 90 ? 'Outstanding!' : accuracy >= 70 ? 'Great job!' : 'Keep practicing!'}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <button
                        onClick={restartQuiz}
                        className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105"
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
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-xl text-gray-600">Loading your next challenge...</p>
                  </div>
                ) : quiz.currentQuestion ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative group">
                        <div className={`text-8xl font-black mb-4 p-8 rounded-2xl border-3 shadow-xl transition-all duration-300 ${
                          quiz.quizType === 'kanji' 
                            ? 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border-red-200 text-red-900 shadow-red-200/50' 
                            : quiz.quizType === 'hiragana'
                            ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 text-blue-900 shadow-blue-200/50'
                            : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200 text-green-900 shadow-green-200/50'
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
                                <div className="text-lg font-bold text-blue-900 mb-2">
                                  Primary: {quiz.currentQuestion.reading}
                                </div>
                                
                                {/* Romaji pronunciation */}
                                <div className="bg-purple-100 px-3 py-1 rounded-lg border border-purple-300 mb-3">
                                  <div className="text-sm font-black text-purple-900 tracking-wider">
                                    Romaji: ({convertKanaToRomaji(quiz.currentQuestion.reading)})
                                  </div>
                                </div>
                                
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
                              
                              <div className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
                                <span className="font-medium">📚 Complete reading reference</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-lg text-gray-600 mb-4">
                        What is the <span className="font-semibold text-indigo-600">
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
                          className="text-2xl text-gray-700 p-4 border-2 border-gray-300 rounded-xl text-center w-full max-w-md mx-auto block focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 bg-white shadow-lg"
                          disabled={quiz.showAnswer}
                          autoFocus
                        />
                      </div>

                      {quiz.feedback && (
                        <div className={`text-lg p-4 rounded-xl border-2 max-w-md mx-auto ${
                          quiz.feedback.includes('✅') 
                            ? 'bg-green-50 text-green-800 border-green-200' 
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}>
                          {quiz.feedback}
                        </div>
                      )}

                      <div className="flex justify-center">
                        {!quiz.showAnswer ? (
                          <button
                            onClick={checkAnswer}
                            disabled={!quiz.userAnswer.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                          >
                            ✨ Check Answer
                          </button>
                        ) : (
                          <button
                            onClick={nextQuestion}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            🚀 Next Question
                          </button>
                        )}
                      </div>

                      <div className="text-xs text-gray-500">
                        💡 Press <kbd className="px-2 py-1 bg-gray-100 rounded border text-xs">Enter</kbd> to {quiz.showAnswer ? 'continue' : 'submit'}
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
  );
};
