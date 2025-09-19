export interface KanjiData {
  kanji: string;
  grade: number;
  stroke_count: number;
  meanings: string[];
  kun_readings: string[];
  on_readings: string[];
  name_readings: string[];
  jlpt: number | null;
  unicode: string;
  freq_mainichi_shinbun?: number;
  heisig_en?: string;
  notes?: string[];
}

export interface KanjiQuizItem {
  character: string;
  meaning: string;
  reading: string;
  on_readings: string[];
  name_readings: string[];
  kun_readings: string[];
  type: 'kanji';
}

const KANJI_API_BASE = process.env.NEXT_PUBLIC_KANJI_API_BASE;

// Cache configuration
const CACHE_PREFIX = 'kanji_cache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper functions for localStorage caching
const getCacheKey = (key: string) => `${CACHE_PREFIX}${key}`;

const getCachedData = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(getCacheKey(key));
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(getCacheKey(key));
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

const setCachedData = <T>(key: string, data: T): void => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(getCacheKey(key), JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
};

// Utility functions for cache management
export const clearKanjiCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('Kanji cache cleared successfully');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

export const getCacheInfo = (): { totalItems: number; totalSize: string; items: Array<{ key: string; size: string; age: string }> } => {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    let totalSize = 0;
    const items: Array<{ key: string; size: string; age: string }> = [];
    
    cacheKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        const size = new Blob([value]).size;
        totalSize += size;
        
        try {
          const { timestamp } = JSON.parse(value);
          const age = Math.round((Date.now() - timestamp) / (1000 * 60)); // minutes
          items.push({
            key: key.replace(CACHE_PREFIX, ''),
            size: `${(size / 1024).toFixed(2)} KB`,
            age: `${age}m ago`
          });
        } catch {
          items.push({
            key: key.replace(CACHE_PREFIX, ''),
            size: `${(size / 1024).toFixed(2)} KB`,
            age: 'unknown'
          });
        }
      }
    });
    
    return {
      totalItems: cacheKeys.length,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
      items: items.sort((a, b) => a.key.localeCompare(b.key))
    };
  } catch (error) {
    console.error('Error getting cache info:', error);
    return { totalItems: 0, totalSize: '0 KB', items: [] };
  }
};

export const fetchKanjiData = async (character: string): Promise<KanjiData> => {
  // Check cache first
  const cacheKey = `kanji_${character}`;
  const cachedData = getCachedData<KanjiData>(cacheKey);
  
  if (cachedData) {
    console.log(`Cache hit for kanji: ${character}`);
    return cachedData;
  }
  
  // Fetch from API if not in cache
  console.log(`Cache miss for kanji: ${character}, fetching from API`);
  const response = await fetch(`${KANJI_API_BASE}/kanji/${character}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch kanji data for ${character}`);
  }
  
  const data = await response.json();
  
  // Cache the result
  setCachedData(cacheKey, data);
  
  return data;
};

export const fetchKanjiList = async (grade?: number): Promise<string[]> => {
  // Check cache first
  const cacheKey = grade ? `kanji_list_grade_${grade}` : 'kanji_list_joyo';
  const cachedData = getCachedData<string[]>(cacheKey);
  
  if (cachedData) {
    console.log(`Cache hit for kanji list: ${cacheKey}`);
    return cachedData;
  }
  
  // Fetch from API if not in cache
  console.log(`Cache miss for kanji list: ${cacheKey}, fetching from API`);
  const endpoint = grade ? `${KANJI_API_BASE}/kanji/grade-${grade}` : `${KANJI_API_BASE}/kanji/joyo`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch kanji list`);
  }
  
  const data = await response.json();
  
  // Cache the result
  setCachedData(cacheKey, data);
  
  return data;
};

export const fetchJLPTKanjiList = async (jlptLevel: number): Promise<string[]> => {
  // Check cache first
  const cacheKey = `kanji_list_jlpt_${jlptLevel}`;
  const cachedData = getCachedData<string[]>(cacheKey);
  
  if (cachedData) {
    console.log(`Cache hit for JLPT kanji list: N${jlptLevel}`);
    return cachedData;
  }
  
  // Fetch from API if not in cache
  console.log(`Cache miss for JLPT kanji list: N${jlptLevel}, fetching from API`);
  const endpoint = `${KANJI_API_BASE}/kanji/jlpt-${jlptLevel}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch JLPT N${jlptLevel} kanji list`);
  }
  
  const data = await response.json();
  
  // Cache the result
  setCachedData(cacheKey, data);
  
  return data;
};

export const fetchAllKanjiList = async (): Promise<string[]> => {
  // Check cache first
  const cacheKey = 'kanji_list_all';
  const cachedData = getCachedData<string[]>(cacheKey);
  
  if (cachedData) {
    console.log('Cache hit for all kanji list');
    return cachedData;
  }
  
  // Fetch from API if not in cache
  console.log('Cache miss for all kanji list, fetching from API');
  const endpoint = `${KANJI_API_BASE}/kanji/all`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch all kanji list`);
  }
  
  const data = await response.json();
  
  // Cache the result
  setCachedData(cacheKey, data);
  
  return data;
};

export const getKanjiByJLPT = async (jlptLevel: number): Promise<string[]> => {
  try {
    return await fetchJLPTKanjiList(jlptLevel);
  } catch (error) {
    console.error(`Failed to fetch JLPT N${jlptLevel} kanji:`, error);
    // Return fallback kanji for each level
    const fallbackKanji: { [key: number]: string[] } = {
      5: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '人', '日', '月', '火', '水', '木', '金', '土', '大', '小'],
      4: ['会', '同', '事', '自', '社', '発', '者', '地', '業', '方', '新', '場', '手', '数', '現', '全', '表', '戦', '経', '最'],
      3: ['政', '議', '民', '連', '対', '部', '合', '市', '内', '相', '定', '回', '選', '米', '実', '関', '決', '全', '表', '戦'],
      2: ['認', '調', '域', '担', '額', '技', '術', '専', '門', '備', '財', '政', '管', '制', '効', '率', '益', '格', '差', '層'],
      1: ['憲', '法', '律', '令', '規', '則', '条', '項', '款', '号', '附', '則', '改', '正', '廃', '止', '施', '行', '適', '用']
    };
    return fallbackKanji[jlptLevel] || fallbackKanji[5];
  }
};

export const getRandomKanjiQuizItems = async (
  count: number = 10, 
  grade?: number, 
  jlptLevel?: number
): Promise<KanjiQuizItem[]> => {
  try {
    let kanjiList: string[];
    
    if (jlptLevel) {
      kanjiList = await fetchJLPTKanjiList(jlptLevel);
    } else if (grade) {
      kanjiList = await fetchKanjiList(grade);
    } else {
      // If no specific level is selected, use all kanji (limited for performance)
      const allKanji = await fetchAllKanjiList();
      kanjiList = allKanji.slice(0, 1000); // Limit to first 1000 for performance
    }
    
    if (kanjiList.length === 0) {
      throw new Error('No kanji found for the specified criteria');
    }
    
    const shuffled = kanjiList.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, kanjiList.length));
    
    const quizItems: KanjiQuizItem[] = [];
    
    for (const character of selected) {
      try {
        const kanjiData = await fetchKanjiData(character);
        // Get all meanings, join with comma if multiple
        const meaning = kanjiData.meanings.length > 0 ? kanjiData.meanings.join(', ') : 'Unknown';
        // Prefer name_readings, fallback to on_readings
        const reading = kanjiData.name_readings.length > 0 
          ? kanjiData.name_readings[0] 
          : (kanjiData.on_readings.length > 0 ? kanjiData.on_readings[0] : 'Unknown');
        
        quizItems.push({
          character,
          meaning,
          reading,
          on_readings: kanjiData.on_readings,
          name_readings: kanjiData.name_readings,
          kun_readings: kanjiData.kun_readings,
          type: 'kanji'
        });
      } catch (error) {
        console.error(`Failed to fetch data for kanji ${character}:`, error);
        // Add fallback data if API fails for specific kanji
        quizItems.push({
          character,
          meaning: 'Unknown',
          reading: 'Unknown',
          on_readings: [],
          name_readings: [],
          kun_readings: [],
          type: 'kanji'
        });
      }
    }
    
    return quizItems;
  } catch (error) {
    console.error('Failed to fetch kanji quiz items:', error);
    // Return some fallback kanji if API fails
    const fallbackKanji: KanjiQuizItem[] = [
      { character: '猫', meaning: 'cat', reading: 'ねこ', on_readings: [], name_readings: ['ねこ'], kun_readings: [], type: 'kanji' },
      { character: '犬', meaning: 'dog', reading: 'いぬ', on_readings: [], name_readings: ['いぬ'], kun_readings: [], type: 'kanji' },
      { character: '水', meaning: 'water', reading: 'みず', on_readings: ['スイ'], name_readings: ['みず'], kun_readings: [], type: 'kanji' },
      { character: '火', meaning: 'fire', reading: 'ひ', on_readings: ['カ'], name_readings: ['ひ'], kun_readings: [], type: 'kanji' },
      { character: '木', meaning: 'tree', reading: 'き', on_readings: ['ボク', 'モク'], name_readings: ['き'], kun_readings: [], type: 'kanji' },
      { character: '人', meaning: 'person', reading: 'ひと', on_readings: ['ジン', 'ニン'], name_readings: ['ひと'], kun_readings: [], type: 'kanji' },
      { character: '大', meaning: 'big', reading: 'だい', on_readings: ['ダイ', 'タイ'], name_readings: ['おお'], kun_readings: [], type: 'kanji' },
      { character: '小', meaning: 'small', reading: 'しょう', on_readings: ['ショウ'], name_readings: ['ちい', 'こ'], kun_readings: [], type: 'kanji' },
      { character: '日', meaning: 'day', reading: 'にち', on_readings: ['ニチ', 'ジツ'], name_readings: ['ひ', 'か'], kun_readings: [], type: 'kanji' },
      { character: '月', meaning: 'month', reading: 'げつ', on_readings: ['ゲツ', 'ガツ'], name_readings: ['つき'], kun_readings: [], type: 'kanji' },
    ];
    
    return fallbackKanji.slice(0, count);
  }
};
