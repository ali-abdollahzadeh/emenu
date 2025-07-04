export interface Category {
  id: string;
  name: string;
  icon: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imagePath: string;
  sortOrder: number;
} 