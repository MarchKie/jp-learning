import React from 'react';
import { QuizType } from '@/hooks/useQuizState';
import { getQuizModeLabel } from '@/utils/quizUtils';

interface QuizProgressProps {
  quizType: QuizType;
  quizMode: string;
  jlptLevel?: number;
  kanjiGrade?: number;
  usedCharacters: string[];
  availableCharacters: string[];
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  quizType,
  quizMode,
  jlptLevel,
  kanjiGrade,
  usedCharacters,
  availableCharacters,
}) => {
  const progressPercentage = availableCharacters.length > 0 
    ? (usedCharacters.length / availableCharacters.length) * 100 
    : 0;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100 p-5">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white text-sm">📊</span>
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">Learning Progress</h3>
          <p className="text-xs text-gray-500">Track your journey</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2 text-xs">🎯</span>
            <div>
              <div className="text-xs font-semibold text-blue-800">Current Mode</div>
              <div className="text-xs text-blue-600">{getQuizModeLabel(quizMode as any, quizType)}</div>
            </div>
          </div>
        </div>

        {quizType === 'kanji' && (jlptLevel || kanjiGrade) && (
          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center">
              <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2 text-xs">🎌</span>
              <div>
                <div className="text-xs font-semibold text-purple-800">Difficulty Level</div>
                <div className="text-xs text-purple-600">
                  {jlptLevel ? `JLPT N${jlptLevel}` : `Grade ${kanjiGrade}`}
                </div>
              </div>
            </div>
          </div>
        )}

        {availableCharacters.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-gray-700">Progress</div>
              <div className="text-xs font-bold text-indigo-600">
                {usedCharacters.length}/{availableCharacters.length} ({Math.round(progressPercentage)}%)
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Show completed characters */}
            {usedCharacters.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-green-700 flex items-center">
                    <span className="w-3 h-3 bg-green-100 rounded mr-1 flex items-center justify-center text-xs">✓</span>
                    Completed
                  </div>
                  <div className="text-xs text-green-600 font-medium">{usedCharacters.length}</div>
                </div>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-2 bg-green-50 rounded-lg border border-green-200">
                  {usedCharacters.slice(0, 12).map((char, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 text-xs font-medium rounded border border-green-300"
                    >
                      {char}
                    </span>
                  ))}
                  {usedCharacters.length > 12 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-200 text-green-700 text-xs font-bold rounded border border-green-300">
                      +{usedCharacters.length - 12}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {/* Show remaining characters preview */}
            {availableCharacters.length > usedCharacters.length && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-gray-600 flex items-center">
                    <span className="w-3 h-3 bg-gray-100 rounded mr-1 flex items-center justify-center text-xs">⏳</span>
                    Remaining
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {availableCharacters.length - usedCharacters.length}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                  {availableCharacters
                    .filter(char => !usedCharacters.includes(char))
                    .slice(0, 12)
                    .map((char, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 text-xs font-medium rounded border border-gray-300"
                    >
                      {char}
                    </span>
                  ))}
                  {availableCharacters.filter(char => !usedCharacters.includes(char)).length > 12 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-600 text-xs font-bold rounded border border-gray-300">
                      +{availableCharacters.filter(char => !usedCharacters.includes(char)).length - 12}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
