import {
  ReactNode,
  ReactElement,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useFetch } from "../hooks/useFetch";
import { BOARD_COLUMNS_URL, COLUMN_CARDS_URL, BOARD_ID } from "../constants";
import { AppContext, defaultAppState } from "./appContext";
import { BoardColumn, ColumnCard } from "../types";
import { generateRandomStr } from "../utils";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

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

  const {
    isPending: isBulkColumnsUpdateLoading,
    error: bulkColumnsUpdateError,
    dispatch: bulkColumnsUpdateRequest,
  } = useFetch(
    `${BOARD_COLUMNS_URL}/bulk`,
    {
      method: "PUT",
    },
    false
  );

  const {
    isPending: isColumnUpdateLoading,
    error: columnUpdateError,
    dispatch: columnUpdateRequest,
  } = useFetch(
    `${BOARD_COLUMNS_URL}`,
    {
      method: "PUT",
    },
    false
  );

  const {
    isPending: isBulkCardUpdateLoading,
    error: bulkCardUpdateError,
    dispatch: bulkCardUpdateRequest,
  } = useFetch(
    `${COLUMN_CARDS_URL}/bulk`,
    {
      method: "PUT",
    },
    false
  );

  const {
    isPending: isCreateCardLoading,
    error: createCardError,
    dispatch: createCardRequest,
  } = useFetch(
    `${COLUMN_CARDS_URL}`,
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

    await createColumnRequest({
      overrideOptions: {
        headers,
        body: JSON.stringify(createColumnPayload),
      },
    });
  }, [createColumnRequest, boardColumns]);

  const deleteColumn = useCallback(
    async (id: string) => {
      // ensure that at least one column is available on the board
      if (boardColumns.length > 1) {
        await deleteColumnRequest({
          overrideUrl: `${BOARD_COLUMNS_URL}/${id}`,
        });
      }
    },
    [deleteColumnRequest, boardColumns]
  );

  const updateColumnsOrder = useCallback(
    async (columns: BoardColumn[]) => {
      const updatePayload = columns.map((column) => ({
        id: column.id,
        ordinal: column.ordinal,
      }));

      await bulkColumnsUpdateRequest({
        overrideOptions: {
          headers,
          body: JSON.stringify(updatePayload),
        },
      });
    },
    [bulkColumnsUpdateRequest]
  );

  const addNewCaseCard = useCallback(async (createCardPayload: Partial<ColumnCard>) => {
    await createCardRequest({
      overrideOptions: {
        headers,
        body: JSON.stringify(createCardPayload),
      },
    });
  }, [createCardRequest]);

  const updateCardsOrder = useCallback(async (cards: ColumnCard[]) => {
    const updateCardsPayload = cards.map((card, idx) => {
      const { id, boardColumnId } = card;

      return {
        id,
        ordinal: idx + 1,
        boardColumnId
      }
    });

    await bulkCardUpdateRequest({
      overrideOptions: {
        headers,
        body: JSON.stringify(updateCardsPayload),
      },
    });
  }, [bulkCardUpdateRequest])

  const appState = useMemo(() => {
    return {
      ...defaultAppState,
      boardColumns,
      isLoading,
      error,
      addNewColumn,
      deleteColumn,
      addNewCaseCard,
      updateColumnsOrder,
      updateCardsOrder,
    };
  }, [
    isLoading,
    boardColumns,
    error,
    addNewColumn,
    deleteColumn,
    addNewCaseCard,
    updateColumnsOrder,
    updateCardsOrder,
  ]);

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};
