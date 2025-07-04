export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: '1', name: 'نوشیدنی های گرم بر پایه اسپرسو', icon: '☕' },
  { id: '2', name: 'چای و نوشیدنی گرم', icon: '🍵' },
  { id: '3', name: 'نوشیدنی های سرد بر پایه اسپرسو', icon: '🥶' },
  { id: '4', name: 'نوشیدنی سرد', icon: '🥤' },
  { id: '5', name: 'شیک', icon: '🥛' },
  { id: '6', name: 'کیک و دسر', icon: '🍰' },
  { id: '7', name: 'میان وعده', icon: '🥪' },
  { id: '8', name: 'قلیون', icon: '🫧' },
];

