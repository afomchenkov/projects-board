import {
  ReactNode,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFetch } from "../hooks/useFetch";
import { BOARD_COLUMNS_URL, BOARD_ID } from "../constants";
import { AppContext, defaultAppState } from "./appContext";
import { BoardColumn } from "../types";

export type AppProviderType = (params: { children: ReactNode }) => ReactElement;

export const AppProvider: AppProviderType = ({ children }) => {
  const [boardColumns, setBoardColumns] = useState<BoardColumn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data,
    isPending: isBoardColumnsLoading,
    error: loadColumnsError,
  } = useFetch(`${BOARD_COLUMNS_URL}?boardId=${BOARD_ID}`);

  useEffect(() => {
    if (!isBoardColumnsLoading && !loadColumnsError) {
      setBoardColumns(data?.items || []);
    }

    if (loadColumnsError) {
      setError(loadColumnsError);
    }

    setIsLoading(isBoardColumnsLoading);
  }, [loadColumnsError, isBoardColumnsLoading, data]);

  const appState = useMemo(() => {
    return {
      ...defaultAppState,
      boardColumns,
      isLoading,
      error,
    };
  }, [isLoading, boardColumns, error]);

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};
