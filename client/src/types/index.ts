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

export type CardOrderUpdateAction = {
  sourceColumnId: string;
  destinationColumnId: string;
  startIndex: number;
  destinationIndex: number;
};

export type BoardState = {
  columnMap: BoardColumnsMap;
  columnsOnAppLoad: BoardColumn[];
  orderedColumnIds: string[];
  actionType: BoardActionType;
  cardOrderUpdateAction: CardOrderUpdateAction | null;
};

export enum BoardActionType {
  ChangeColumnsOrder = "ChangeColumnsOrder",
  ChangeCardsOrder = "ChangeCardsOrder",
  MoveCardToAnotherColumn = "MoveCardToAnotherColumn",
  None = "None",
}
