export interface Product {
  id: number;
  name: string;
  slug: string;
  icon_url: string;
  services: Array<object>;
  categories: Array<object>;
}

export interface Service {
  id: number;
  name: string;
  content: string;
}
