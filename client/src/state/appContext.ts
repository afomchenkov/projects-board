import { createContext, useContext } from "react";
import { BoardColumn } from "../types";
import { Noop } from "../utils";

export type AppState = {
  boardColumns: BoardColumn[];
  isLoading: boolean;
  error: string | null;
  addNewColumn: () => void;
  deleteColumn: (id: string) => void;
  addNewCaseCard: () => void;
}

export const defaultAppState = {
  boardColumns: [],
  isLoading: false,
  error: null,
  addNewColumn: Noop,
  deleteColumn: Noop,
  addNewCaseCard: Noop,
};

export const AppContext = createContext<AppState>(defaultAppState);

export const useAppContext = () => {
  return useContext(AppContext);
};
