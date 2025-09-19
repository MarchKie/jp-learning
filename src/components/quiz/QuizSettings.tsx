import React from 'react';
import { QuizType, QuizMode } from '@/hooks/useQuizState';

interface QuizSettingsProps {
  quizType: QuizType;
  quizMode: QuizMode;
  jlptLevel?: number;
  kanjiGrade?: number;
  onQuizTypeChange: (type: QuizType) => void;
  onQuizModeChange: (mode: QuizMode) => void;
  onJlptLevelChange: (level?: number) => void;
  onKanjiGradeChange: (grade?: number) => void;
}

export const QuizSettings: React.FC<QuizSettingsProps> = ({
  quizType,
  quizMode,
  jlptLevel,
  kanjiGrade,
  onQuizTypeChange,
  onQuizModeChange,
  onJlptLevelChange,
  onKanjiGradeChange,
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100 p-6 mb-4">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white text-lg">⚙️</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quiz Settings</h2>
          <p className="text-xs text-gray-500">Customize your learning experience</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="space-y-2">
          <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
            <span className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center mr-2 text-xs">🈁</span>
            Quiz Type
          </label>
          <div className="relative">
            <select
              value={quizType}
              onChange={(e) => onQuizTypeChange(e.target.value as QuizType)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer text-gray-700 text-sm"
            >
              <option value="hiragana">🈁 Hiragana</option>
              <option value="katakana">🈂 Katakana</option>
              <option value="kanji">🈳 Kanji</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
            <span className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center mr-2 text-xs">🎯</span>
            Quiz Mode
          </label>
          <div className="relative">
            <select
              value={quizMode}
              onChange={(e) => onQuizModeChange(e.target.value as QuizMode)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer text-gray-700 text-sm"
            >
              <option value="character-to-romaji">
                {quizType === 'kanji' ? '📝 Character → Meaning' : '📝 Character → Romaji'}
              </option>
              <option value="romaji-to-character">
                {quizType === 'kanji' ? '🔤 Reading → Character' : '🔤 Romaji → Character'}
              </option>
              {quizType === 'kanji' && (
                <option value="meaning-to-character">💭 Meaning → Character</option>
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Kanji Level Selection */}
      {quizType === 'kanji' && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center mb-3">
            <span className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-2 text-xs">🎌</span>
            <h3 className="text-base font-semibold text-gray-800">Difficulty Level</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                <span className="w-5 h-5 bg-red-100 rounded-lg flex items-center justify-center mr-2 text-xs">🏮</span>
                JLPT Level
              </label>
              <div className="relative">
                <select
                  value={jlptLevel || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    onJlptLevelChange(value ? parseInt(value) : undefined);
                    onKanjiGradeChange(undefined);
                  }}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 appearance-none cursor-pointer text-gray-700 text-sm"
                >
                  <option value="">🌟 All Kanji (Complete Data)</option>
                  <option value="5">🟢 N5 - Beginner (79 kanji)</option>
                  <option value="4">🔵 N4 - Elementary (166 kanji)</option>
                  <option value="3">🟡 N3 - Intermediate (367 kanji)</option>
                  <option value="2">🟠 N2 - Upper Intermediate (367 kanji)</option>
                  <option value="1">🔴 N1 - Advanced (1232 kanji)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                <span className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center mr-2 text-xs">🏫</span>
                School Grade
              </label>
              <div className="relative">
                <select
                  value={kanjiGrade || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    onKanjiGradeChange(value ? parseInt(value) : undefined);
                    onJlptLevelChange(undefined);
                  }}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none cursor-pointer text-gray-700 text-sm"
                >
                  <option value="">📚 All Grades</option>
                  <option value="1">1️⃣ Grade 1</option>
                  <option value="2">2️⃣ Grade 2</option>
                  <option value="3">3️⃣ Grade 3</option>
                  <option value="4">4️⃣ Grade 4</option>
                  <option value="5">5️⃣ Grade 5</option>
                  <option value="6">6️⃣ Grade 6</option>
                  <option value="8">🎓 Junior High & High School</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
