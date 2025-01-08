import {
  ReactNode,
  ReactElement,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useFetch } from "../hooks/useFetch";
import { useMountedRef } from "../hooks/useMountedRef";
import { BOARD_COLUMNS_URL, BOARD_ID } from "../constants";
import { AppContext, defaultAppState } from "./appContext";
import { BoardColumn } from "../types";
import { generateRandomStr } from "../utils";

const calculateNextColumnOrdinal = (columns: BoardColumn[]) => {
  const ordinals = columns.map((column) => column.ordinal);
  ordinals.sort((a, b) => a - b);
  return (ordinals.at(-1) || 0) + 1;
};

export type AppProviderType = (params: { children: ReactNode }) => ReactElement;

export const AppProvider: AppProviderType = ({ children }) => {
  const [boardColumns, setBoardColumns] = useState<BoardColumn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useMountedRef();

  const {
    data,
    isPending: isBoardColumnsLoading,
    error: loadColumnsError,
    dispatch: fetchBoardColumns,
  } = useFetch(`${BOARD_COLUMNS_URL}?boardId=${BOARD_ID}`);

  const {
    isPending: isDeleteBoardColumnsLoading,
    error: deleteColumnsError,
    dispatch: deleteColumnRequest,
  } = useFetch(
    `${BOARD_COLUMNS_URL}`,
    {
      method: "DELETE",
    },
    false
  );

  const {
    isPending: isCreateBoardColumnsLoading,
    error: createColumnsError,
    dispatch: createColumnRequest,
  } = useFetch(
    `${BOARD_COLUMNS_URL}`,
    {
      method: "POST",
    },
    false
  );

  useEffect(() => {
    if (!isBoardColumnsLoading && !loadColumnsError) {
      setBoardColumns(data?.items || []);
    }

    if (loadColumnsError) {
      setError(loadColumnsError);
    }

    setIsLoading(isBoardColumnsLoading);
  }, [loadColumnsError, isBoardColumnsLoading, data]);

  // reload columns after column delete/create
  useEffect(() => {
    if (deleteColumnsError || createColumnsError) {
      setError(deleteColumnsError);
    }

    if (!isDeleteBoardColumnsLoading && !isCreateBoardColumnsLoading) {
      fetchBoardColumns();
    }

    setIsLoading(isDeleteBoardColumnsLoading || isCreateBoardColumnsLoading);
  }, [
    isCreateBoardColumnsLoading,
    createColumnsError,
    isDeleteBoardColumnsLoading,
    deleteColumnsError,
    fetchBoardColumns,
  ]);

  const addNewColumn = useCallback(async () => {
    const createColumnPayload = {
      name: `new-column-${generateRandomStr(4)}`,
      description: `new-column-description-${generateRandomStr(24)}`,
      ordinal: calculateNextColumnOrdinal(boardColumns),
      boardId: boardColumns[0].boardId,
    };

    // ensure that at least one column is available on the board
    if (boardColumns.length > 1) {
      await createColumnRequest({
        overrideOptions: {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createColumnPayload),
        },
      });
    }
  }, [createColumnRequest, boardColumns]);

  const deleteColumn = useCallback(
    async (id: string) => {
      await deleteColumnRequest({
        overrideUrl: `${BOARD_COLUMNS_URL}/${id}`,
      });
    },
    [deleteColumnRequest]
  );

  const addNewCaseCard = useCallback(async () => {
    // const createCardPayload = {
    //   name: `new-column-${generateRandomStr(4)}`,
    //   description: `new-column-description-${generateRandomStr(24)}`,
    //   ordinal: calculateNextColumnOrdinal(boardColumns),
    //   boardId: boardColumns[0].boardId,
    // };
  }, []);

  const appState = useMemo(() => {
    return {
      ...defaultAppState,
      boardColumns,
      isLoading,
      error,
      addNewColumn,
      deleteColumn,
      addNewCaseCard,
    };
  }, [isLoading, boardColumns, error, addNewColumn, deleteColumn]);

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};
