export type Relation = 'sister' | 'brother' | 'friend' | 'love' | 'bestFriend';

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface BirthdayWish {
  recipientName: string;
  dateOfBirth: string;
  description: string;
  imageUrls: string[];
  createdBy: string;
  relation: Relation;
}