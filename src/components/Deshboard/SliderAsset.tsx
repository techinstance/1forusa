export interface SliderAsset {
  id: string;
  title: string;
  description: string;
  assetType: 'image' | 'video' | 'audio' | 'lottie' | 'game' | 'doc' | 'presentation' | 'text';
  assetUrl: string;         // Main asset (image, video, etc.)
  backupUrl?: string;       // GDrive backup link
  joyText?: string;         // Motivation
  timer?: number;           // For timed activities (optional)
  feedbackType?: 'swipe' | 'button' | 'form';
}

export const sliderAssets: SliderAsset[] = [
  {
    id: 'a1',
    title: 'Poverty',
    description: 'Living paycheck to paycheck? You’re not alone. Start your journey here.',
    assetType: 'image',
    assetUrl: 'https://example.com/assets/poverty.jpg',
    joyText: 'You can change your story!',
    feedbackType: 'swipe',
  },
  {
    id: 'a2',
    title: 'Write Your Goals',
    description: 'Writing your goals increases your success chances by 42%. Try now.',
    assetType: 'text',
    assetUrl: 'https://example.com/assets/write-goals.txt',
    joyText: 'One small step today!',
    feedbackType: 'form',
  },
  {
    id: 'a3',
    title: 'Take Action',
    description: 'Even small actions toward your goal build massive momentum.',
    assetType: 'lottie',
    assetUrl: 'https://example.com/assets/action.json',
    joyText: 'Tiny steps → Big impact!',
    feedbackType: 'button',
  },
  {
    id: 'a4',
    title: 'Save & Invest',
    description: 'Saving $5/day can turn into $50,000 in 10 years. Start now!',
    assetType: 'video',
    assetUrl: 'https://example.com/assets/save-invest.mp4',
    joyText: 'Make money your ally.',
    feedbackType: 'swipe',
  },
  {
    id: 'a5',
    title: 'Financial Freedom',
    description: 'True freedom isn’t fancy stuff — it’s control over your time.',
    assetType: 'image',
    assetUrl: 'https://example.com/assets/freedom.jpg',
    joyText: 'Live life on your terms.',
    feedbackType: 'button',
  }
];
export default sliderAssets;