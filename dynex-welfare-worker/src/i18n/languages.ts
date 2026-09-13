export interface LanguageOption {
  code: string;
  nativeName: string;
  englishName: string;
  isRTL: boolean;
}

// Order shown on the language-select screen.
export const LANGUAGES: LanguageOption[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', isRTL: false },
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu', isRTL: true },
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', isRTL: true },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', isRTL: false },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bangla', isRTL: false },
  { code: 'ne', nativeName: 'नेपाली', englishName: 'Nepali', isRTL: false },
  { code: 'tl', nativeName: 'Filipino', englishName: 'Filipino', isRTL: false },
  { code: 'zh', nativeName: '中文', englishName: 'Chinese', isRTL: false },
];

export const DEFAULT_LANGUAGE = 'en';
