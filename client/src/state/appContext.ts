import { createContext, useContext } from "react";
import { BoardColumn } from "../types";

export type AppState = {
  boardColumns: BoardColumn[];
  isLoading: boolean;
  error: string | null;
}

export const defaultAppState = {
  boardColumns: [],
  isLoading: false,
  error: null,
};

export const AppContext = createContext<AppState>(defaultAppState);

export const useAppContext = () => {
  return useContext(AppContext);
};
