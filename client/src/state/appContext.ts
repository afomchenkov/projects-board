import { createContext, useContext } from "react";
import { BoardColumn, ColumnCard } from "../types";
import { Noop, NoopAsync } from "../utils";

export type AppState = {
  boardColumns: BoardColumn[];
  isLoading: boolean;
  error: string | null;
  fetchColumn: (id: string) => Promise<BoardColumn>;
  addNewColumn: () => Promise<string>;
  deleteColumn: (id: string) => Promise<string | null>;
  addNewCaseCard: (card: Partial<ColumnCard>) => Promise<ColumnCard>;
  updateColumnsOrder: (columns: BoardColumn[]) => void;
  updateColumn: (column: BoardColumn) => void;
  updateCardsOrder: (cards: ColumnCard[]) => void;
}

export const defaultAppState = {
  boardColumns: [],
  isLoading: false,
  error: null,
  fetchColumn: NoopAsync,
  addNewColumn: NoopAsync,
  deleteColumn: NoopAsync,
  addNewCaseCard: NoopAsync,
  updateColumnsOrder: Noop,
  updateColumn: Noop,
  updateCardsOrder: Noop,
};

export const AppContext = createContext<AppState>(defaultAppState);

export const useAppContext = () => {
  return useContext(AppContext);
};
