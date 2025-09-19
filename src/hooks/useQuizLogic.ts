import { useEffect } from 'react';
import { hiraganaData, katakanaData } from '@/data/kanaData';
import { fetchJLPTKanjiList, fetchKanjiList, fetchAllKanjiList, fetchKanjiData } from '@/data/kanjiApi';
import { QuizType, QuizMode, QuizItem, useQuizState } from './useQuizState';

export const useQuizLogic = () => {
  const quizState = useQuizState();
  const {
    quizType,
    quizMode,
    jlptLevel,
    kanjiGrade,
    availableCharacters,
    currentQuestion,
    usedCharacters,
    isCompleted,
    setAvailableCharacters,
    setUsedCharacters,
    setIsCompleted,
    setCurrentQuestion,
    setIsLoading,
    setUserAnswer,
    setFeedback,
    setShowAnswer,
    resetQuiz,
  } = quizState;

  // Get all kanji with complete readings
  const getAllKanjiWithReadings = async (): Promise<string[]> => {
    try {
      const allKanji = await fetchAllKanjiList();
      console.log(`Fetched ${allKanji.length} kanji from API`);
      console.log('Processing all kanji at once...');
      
      const allPromises = allKanji.map(async (character) => {
        try {
          const kanjiData = await fetchKanjiData(character);
          const hasReadings = (kanjiData.on_readings && kanjiData.on_readings.length > 0) ||
                             (kanjiData.name_readings && kanjiData.name_readings.length > 0);
          const hasMeanings = kanjiData.meanings && kanjiData.meanings.length > 0;
          
          if (hasReadings && hasMeanings) {
            return character;
          }
          return null;
        } catch (error) {
          return null;
        }
      });
      
      console.log(`Waiting for ${allPromises.length} API calls to complete...`);
      const allResults = await Promise.all(allPromises);
      const validKanji = allResults.filter(char => char !== null) as string[];
      
      console.log(`✅ Found ${validKanji.length} kanji with complete readings and meanings out of ${allKanji.length} total`);
      return validKanji;
    } catch (error) {
      console.error('Failed to fetch all kanji with readings:', error);
      return await fetchJLPTKanjiList(5);
    }
  };

  // Initialize characters based on quiz type
  const initializeCharacters = async () => {
    if (quizType === 'kanji') {
      try {
        let kanjiList: string[];
        if (jlptLevel) {
          kanjiList = await fetchJLPTKanjiList(jlptLevel);
        } else if (kanjiGrade) {
          kanjiList = await fetchKanjiList(kanjiGrade);
        } else {
          console.log('Loading all kanji with complete readings...');
          kanjiList = await getAllKanjiWithReadings();
        }
        setAvailableCharacters(kanjiList);
      } catch (error) {
        console.error('Error initializing kanji:', error);
        setAvailableCharacters(['猫', '犬', '水', '火', '木', '人', '大', '小', '日', '月']);
      }
    } else {
      const kanaData = quizType === 'hiragana' ? hiraganaData : katakanaData;
      setAvailableCharacters(kanaData.map(kana => kana.character));
    }
    setUsedCharacters([]);
    setIsCompleted(false);
  };

  // Generate a new question
  const generateQuestion = async () => {
    const remainingCharacters = availableCharacters.filter(char => !usedCharacters.includes(char));
    
    console.log(`Generating question: ${remainingCharacters.length} remaining out of ${availableCharacters.length} total`);
    console.log('Used characters:', usedCharacters);
    
    if (remainingCharacters.length === 0) {
      console.log('All characters completed!');
      setIsCompleted(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setUserAnswer('');
    setFeedback('');
    setShowAnswer(false);

    try {
      if (quizType === 'kanji') {
        await generateKanjiQuestion(remainingCharacters);
      } else {
        generateKanaQuestion(remainingCharacters);
      }
    } catch (error) {
      console.error('Error generating question:', error);
      setFeedback('Error loading question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate kanji question
  const generateKanjiQuestion = async (remainingCharacters: string[]) => {
    const randomCharacter = remainingCharacters[Math.floor(Math.random() * remainingCharacters.length)];
    
    try {
      const kanjiData = await fetchKanjiData(randomCharacter);
      const topMeanings = kanjiData.meanings.slice(0, 3);
      const meaning = topMeanings.join(', ');
      
      const nameReadings = kanjiData.name_readings || [];
      const onReadings = kanjiData.on_readings || [];
      const kunReadings = kanjiData.kun_readings || [];
      
      let reading = 'Unknown';
      if (nameReadings.length > 0 && onReadings.length > 0) {
        reading = `${nameReadings[0]} (${onReadings[0]})`;
      } else if (nameReadings.length > 0) {
        reading = nameReadings[0];
      } else if (onReadings.length > 0) {
        reading = onReadings[0];
      }
      
      if (reading === 'Unknown' && meaning !== 'Unknown') {
        console.log(`Kanji ${randomCharacter} has no readings, trying another...`);
        setAvailableCharacters(prev => prev.filter(char => char !== randomCharacter));
        setIsLoading(false);
        return;
      }
      
      let question: QuizItem;
      
      if (quizMode === 'meaning-to-character') {
        question = {
          character: meaning,
          answer: randomCharacter,
          type: 'kanji',
          meaning,
          reading,
          name_readings: nameReadings,
          on_readings: onReadings,
          kun_readings: kunReadings
        };
      } else if (quizMode === 'romaji-to-character') {
        question = {
          character: reading,
          answer: randomCharacter,
          type: 'kanji',
          meaning,
          reading,
          name_readings: nameReadings,
          on_readings: onReadings,
          kun_readings: kunReadings
        };
      } else {
        question = {
          character: randomCharacter,
          answer: meaning,
          type: 'kanji',
          meaning,
          reading,
          name_readings: nameReadings,
          on_readings: onReadings,
          kun_readings: kunReadings
        };
      }
      
      setCurrentQuestion(question);
      setUsedCharacters(prev => [...prev, randomCharacter]);
    } catch (error) {
      console.error(`Error fetching data for kanji ${randomCharacter}:`, error);
      const question: QuizItem = {
        character: randomCharacter,
        answer: 'Unknown',
        type: 'kanji',
        meaning: 'Unknown',
        reading: 'Unknown',
        name_readings: [],
        on_readings: [],
        kun_readings: []
      };
      setCurrentQuestion(question);
      setUsedCharacters(prev => [...prev, randomCharacter]);
    }
  };

  // Generate kana question
  const generateKanaQuestion = (remainingCharacters: string[]) => {
    const randomCharacter = remainingCharacters[Math.floor(Math.random() * remainingCharacters.length)];
    const kanaData = quizType === 'hiragana' ? hiraganaData : katakanaData;
    const selectedKana = kanaData.find(kana => kana.character === randomCharacter);
    
    if (selectedKana) {
      let question: QuizItem;
      if (quizMode === 'romaji-to-character') {
        question = {
          character: selectedKana.romaji,
          answer: selectedKana.character,
          type: quizType
        };
      } else {
        question = {
          character: selectedKana.character,
          answer: selectedKana.romaji,
          type: quizType
        };
      }
      
      setCurrentQuestion(question);
      setUsedCharacters(prev => {
        const newUsed = [...prev, selectedKana.character];
        console.log(`Added ${selectedKana.character} to used characters. Total used: ${newUsed.length}/${availableCharacters.length}`);
        return newUsed;
      });
    }
  };

  // Initialize and generate question when dependencies change
  useEffect(() => {
    resetQuiz();
    setIsLoading(true);
    
    initializeCharacters();
  }, [quizType, quizMode, jlptLevel, kanjiGrade]);

  // Generate question when characters are available
  useEffect(() => {
    if (availableCharacters.length > 0 && !currentQuestion && !isCompleted) {
      generateQuestion();
    }
  }, [availableCharacters]);

  return {
    ...quizState,
    generateQuestion,
    initializeCharacters,
  };
};
