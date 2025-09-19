import React from 'react';
import { QuizStats as QuizStatsType } from '@/hooks/useQuizState';
import { calculateAccuracy } from '@/utils/quizUtils';

interface QuizStatsProps {
  stats: QuizStatsType;
  onResetStats: () => void;
}

export const QuizStats: React.FC<QuizStatsProps> = ({ stats, onResetStats }) => {
  const accuracy = calculateAccuracy(stats.correct, stats.total);

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">📈</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">Quiz Statistics</h3>
            <p className="text-xs text-gray-500">Your performance overview</p>
          </div>
        </div>
        <button
          onClick={onResetStats}
          className="px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 text-xs font-medium shadow-md hover:shadow-lg"
        >
          Reset Stats
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-1">
            <span className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center text-xs">✅</span>
            <div className="text-xl font-bold text-green-600">{stats.correct}</div>
          </div>
          <div className="text-xs font-semibold text-green-700">Correct</div>
          <div className="text-xs text-green-600">Great job!</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-3 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-1">
            <span className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center text-xs">❌</span>
            <div className="text-xl font-bold text-red-600">{stats.incorrect}</div>
          </div>
          <div className="text-xs font-semibold text-red-700">Incorrect</div>
          <div className="text-xs text-red-600">Keep learning!</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-1">
            <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-xs">📊</span>
            <div className="text-xl font-bold text-blue-600">{stats.total}</div>
          </div>
          <div className="text-xs font-semibold text-blue-700">Total</div>
          <div className="text-xs text-blue-600">Questions answered</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-1">
            <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center text-xs">🎯</span>
            <div className="text-xl font-bold text-purple-600">{accuracy}%</div>
          </div>
          <div className="text-xs font-semibold text-purple-700">Accuracy</div>
          <div className="text-xs text-purple-600">
            {accuracy >= 90 ? 'Excellent!' : accuracy >= 70 ? 'Good work!' : 'Keep practicing!'}
          </div>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
          <div className="flex items-center">
            <span className="text-indigo-500 mr-2 text-sm">🏆</span>
            <div className="text-xs text-indigo-700">
              <strong>Performance:</strong> {' '}
              {accuracy >= 90 && "Outstanding! You're mastering Japanese!"}
              {accuracy >= 70 && accuracy < 90 && "Great progress! Keep up the good work!"}
              {accuracy >= 50 && accuracy < 70 && "Good effort! Practice makes perfect!"}
              {accuracy < 50 && stats.total >= 5 && "Don't give up! Every mistake is a learning opportunity!"}
              {stats.total < 5 && "Just getting started! Keep going!"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
