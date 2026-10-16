export interface ProductData {
  title: string;
  slug: string;
  category: string;
  order: number;
  hsn: string;
  hsnNote?: string;
  metaTitle: string;
  metaDescription: string;
  answer: string;
  variants: string[];
  packSizes: string[];
  packaging: string[];
  specs: { label: string; value: string }[];
  moq: string;
  privateLabel: { available: boolean; options: string[] };
  containerLoad?: { ft20: string; ft40: string };
  uses: string[];
  markets: string[];
  faqs: { q: string; a: string }[];
  related: string[];
  image?: string;
}
