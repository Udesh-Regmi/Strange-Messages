export type Relation = 
  | 'sister' 
  | 'brother' 
  | 'friend' 
  | 'lover' 
  | 'one_sided'
  | 'bestFriend' 
  |'girlFriend'
  | 'boyFriend'
  | 'mother' 
  | 'husband'
  | 'nothing'
  | 'father' ;
export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  borderGradient?: string;
  glowEffect?: string;
  particleEffects?: string[];
  animations?: string[];
  decorativeElements?: string[];
  specialEffects?: {
    hover?: string;
    active?: string;
    cards?: string;
    text?: string;
  };
}
export interface BirthdayWish {
  recipientName: string;
  dateOfBirth: string;
  description: string;
  imageUrls: string[];
  createdBy: string;
  relationship: Relation;
}