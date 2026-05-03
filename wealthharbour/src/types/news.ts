export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string[];
  date: string;
  source: string;
  category: 'Geopolitics' | 'Economy' | 'Markets' | 'Tech' | 'Crypto';
  impact?: 'High' | 'Medium' | 'Low';
}
