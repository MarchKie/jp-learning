# 🎌 Japanese Learning Quiz App

A modern, interactive Japanese learning platform built with Next.js, featuring comprehensive quizzes for Hiragana, Katakana, and Kanji characters with advanced reading displays and caching system.

## ✨ Features

### 📚 **Comprehensive Learning System**
- **Hiragana Quiz**: Master all 46 basic hiragana characters + combinations
- **Katakana Quiz**: Learn katakana for foreign words and names  
- **Kanji Quiz**: Study kanji with complete reading information
- **Multiple Quiz Modes**: Character-to-romaji, romaji-to-character, meaning-to-character

### 🎯 **Advanced Kanji Features**
- **Complete Reading Display**: Name readings (名読み), On readings (音読み), Kun readings (訓読み)
- **Romaji Pronunciation**: Every reading includes romaji for pronunciation guidance
- **JLPT Levels**: Filter by JLPT N5-N1 difficulty levels
- **School Grades**: Study by Japanese school grade levels (1-6 + Junior/High School)
- **Karaoke-Style Display**: Beautiful visual presentation of readings

### 🚀 **Performance & UX**
- **LocalStorage Caching**: Fast loading with 24-hour API response caching
- **Real-time Progress Tracking**: Visual progress bars and completion statistics
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradients, animations, and intuitive interface

### 📊 **Learning Analytics**
- **Quiz Statistics**: Track correct/incorrect answers and accuracy
- **Progress Visualization**: See completed vs remaining characters
- **Performance Feedback**: Encouraging messages based on accuracy

## 🛠️ **Technology Stack**

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom gradients and animations
- **State Management**: Custom React hooks for quiz logic
- **Caching**: LocalStorage with expiration for API responses
- **API Integration**: External Kanji API with fallback data
- **Build Tool**: Next.js with TypeScript support

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd jp-learning
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_KANJI_API_BASE=https://your-kanji-api-endpoint
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 **Project Structure**

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── JapaneseQuizRefactored.tsx  # Main quiz component
│   └── quiz/              # Quiz-specific components
│       ├── QuizSettings.tsx       # Quiz configuration
│       ├── QuizProgress.tsx       # Progress tracking
│       └── QuizStats.tsx          # Statistics display
├── data/                  # Data and API
│   ├── kanaData.ts       # Hiragana/Katakana data
│   └── kanjiApi.ts       # Kanji API integration
├── hooks/                 # Custom React hooks
│   ├── useQuizLogic.ts   # Quiz game logic
│   └── useQuizState.ts   # Quiz state management
└── utils/                 # Utility functions
    └── quizUtils.ts      # Quiz helper functions
```

## 🎮 **How to Use**

### 1. **Select Quiz Type**
- Choose between Hiragana, Katakana, or Kanji
- Select difficulty level (JLPT or School Grade for Kanji)

### 2. **Choose Quiz Mode**
- **Character → Romaji/Meaning**: See the character, type the reading/meaning
- **Romaji → Character**: See the romaji, type the character
- **Meaning → Character**: See the meaning, type the kanji

### 3. **Study with Complete Information**
For Kanji, you'll see:
- **Primary Reading**: Main reading being tested
- **Name Readings**: Readings used in names (green badges)
- **On Readings**: Chinese-derived readings (red badges)  
- **Kun Readings**: Native Japanese readings (orange badges)
- **Romaji**: Pronunciation for all readings

### 4. **Track Your Progress**
- View completion statistics
- See which characters you've mastered
- Monitor accuracy and improvement over time

## 🔧 **Configuration**

### Environment Variables
- `NEXT_PUBLIC_KANJI_API_BASE`: Base URL for the Kanji API

### Caching Settings
- **Cache Duration**: 24 hours (configurable in `kanjiApi.ts`)
- **Cache Prefix**: `kanji_cache_` (stored in localStorage)
- **Cache Management**: Automatic expiration and cleanup

## 📱 **Responsive Design**

The app is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar layout
- **Tablet**: Adapted layout with touch-friendly controls
- **Mobile**: Compact design optimized for small screens

## 🎨 **Design Features**

- **Color-Coded Learning**: Different colors for each character type and reading type
- **Smooth Animations**: Engaging transitions and hover effects
- **Modern Typography**: Clean, readable fonts optimized for Japanese characters
- **Accessibility**: High contrast ratios and keyboard navigation support

## 🚀 **Performance Optimizations**

- **API Caching**: Reduces load times by 90%+ on repeat visits
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Optimized loading for any images
- **Bundle Analysis**: Optimized bundle size for fast loading

## 🔮 **Future Enhancements**

- **Spaced Repetition**: Intelligent review scheduling
- **Audio Pronunciation**: Native speaker audio for all readings
- **Writing Practice**: Stroke order practice for kanji
- **Multiplayer Mode**: Compete with friends
- **Offline Mode**: Full offline functionality
- **Progress Sync**: Cloud synchronization across devices

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 **License**

This project is licensed under the MIT License.

## 🙏 **Acknowledgments**

- Kanji data provided by external API
- Hiragana/Katakana data curated for learning
- UI inspiration from modern language learning apps
- Japanese language learning community feedback

---

## 🇹🇭 **ภาษาไทย**

### 📖 **เกี่ยวกับแอป**
แอปพลิเคชันเรียนภาษาญี่ปุ่นที่ทันสมัย สำหรับฝึกฝนฮิรางานะ คาตาคานะ และคันจิ พร้อมระบบแสดงผลการอ่านที่ครบถ้วนและระบบแคชข้อมูลเพื่อความเร็ว

### 🎯 **คุณสมบัติหลัก**
- **ควิซฮิรางานะ**: เรียนรู้ตัวอักษรฮิรางานะทั้ง 46 ตัว
- **ควิซคาตาคานะ**: ฝึกคาตาคานะสำหรับคำต่างประเทศ
- **ควิซคันจิ**: เรียนคันจิพร้อมข้อมูลการอ่านครบถ้วน (Name readings, On readings, Kun readings)
- **โหมดควิซหลากหลาย**: ตัวอักษรเป็นโรมาจิ, โรมาจิเป็นตัวอักษร, ความหมายเป็นตัวอักษร

### 💾 **ระบบแคชข้อมูล**
- เก็บข้อมูล API ใน LocalStorage เป็นเวลา 24 ชั่วโมง
- ลดเวลาโหลดมากกว่า 90% ในการเข้าใช้ครั้งต่อไป
- ระบบทำความสะอาดแคชอัตโนมัติ

### 🎨 **การออกแบบ**
- **ระบบสีแยกประเภท**: สีเขียวสำหรับ Name readings, สีแดงสำหรับ On readings, สีส้มสำหรับ Kun readings
- **การแสดงผลแบบคาราโอเกะ**: สวยงามและเข้าใจง่าย
- **Responsive Design**: ใช้งานได้ดีทุกอุปกรณ์

### 📊 **ติดตามความก้าวหน้า**
- สถิติการทำควิซ (ถูก/ผิด/ความแม่นยำ)
- แสดงตัวอักษรที่เรียนจบแล้ว
- ระบบให้กำลังใจตามผลการเรียน

---

**Happy Learning! 頑張って！ 🎌**
