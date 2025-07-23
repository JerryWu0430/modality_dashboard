export type CellContent = {
  type: 'image' | 'background' | 'model' | 'prompt';
  value: any;
} | null;

export type TableRow = {
  id: number;
  model: CellContent;
  clothingItems: CellContent[];
  prompt: CellContent;
  background: CellContent;
  result: CellContent;
  isGenerating?: boolean;
  generationError?: string;
  taskId?: string;
};

export type Background = {
  id: string;
  name: string;
  preview: string;
};

export type Model = {
  id: string;
  name: string;
  avatar: string;
};

export type Prompt = {
  id: string;
  name: string;
  description: string;
};

export type SelectedImage = {
  url: string;
  rowId: number;
  modelName: string;
  clothingCount: number;
};

export type ExpandedSections = {
  background: boolean;
  model: boolean;
  prompts: boolean;
}; 