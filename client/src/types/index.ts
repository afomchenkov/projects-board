export type BoardColumn = {
  id: string;
  boardId: string;
  name: string;
  description: string;
  ordinal: number;
  createdAt: string;
  updatedAt: string;
  columnCards: ColumnCard[]
}

export type ColumnCard = {
  id: string;
  name: string;
  description: string;
  ordinal: number;
  boardColumnId: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export type BoardColumnsMap = { [columnId: string]: BoardColumn };
