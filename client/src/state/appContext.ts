import { createContext, useContext } from "react";
import { BoardColumn, ColumnCard } from "../types";
import { Noop } from "../utils";

export type AppState = {
  boardColumns: BoardColumn[];
  isLoading: boolean;
  error: string | null;
  addNewColumn: () => void;
  deleteColumn: (id: string) => void;
  addNewCaseCard: (createCard: Partial<ColumnCard>) => void;
  updateColumnsOrder: (columns: BoardColumn[]) => void;
  updateColumn: (column: BoardColumn) => void;
  updateCardsOrder: (cards: ColumnCard[]) => void;
}

export const defaultAppState = {
  boardColumns: [],
  isLoading: false,
  error: null,
  addNewColumn: Noop,
  deleteColumn: Noop,
  addNewCaseCard: Noop,
  updateColumnsOrder: Noop,
  updateColumn: Noop,
  updateCardsOrder: Noop,
};

export const AppContext = createContext<AppState>(defaultAppState);

export const useAppContext = () => {
  return useContext(AppContext);
};
