import {
  ReactNode,
  ReactElement,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import { useFetch } from "../hooks";
import { BOARD_COLUMNS_URL, COLUMN_CARDS_URL, BOARD_ID } from "../constants";
import { AppContext, defaultAppState } from "./appContext";
import { BoardColumn, ColumnCard } from "../types";
import {
  getRandomNumber,
  generateRandomStr,
  calculateNextColumnOrdinal,
} from "../utils";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
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
  } = useFetch(`${BOARD_COLUMNS_URL}?boardId=${BOARD_ID}`);

  const { error: loadColumnError, dispatch: fetchBoardColumn } = useFetch(
    `${BOARD_COLUMNS_URL}`
  );

  const { error: deleteColumnError, dispatch: deleteColumnRequest } = useFetch(
    `${BOARD_COLUMNS_URL}`,
    {
      method: "DELETE",
    },
    false
  );

  const { error: createColumnsError, dispatch: createColumnRequest } = useFetch(
    `${BOARD_COLUMNS_URL}`,
    {
      method: "POST",
    },
    false
  );

  const { error: bulkColumnsUpdateError, dispatch: bulkColumnsUpdateRequest } =
    useFetch(
      `${BOARD_COLUMNS_URL}/bulk`,
      {
        method: "PUT",
      },
      false
    );

  const { error: columnUpdateError, dispatch: columnUpdateRequest } = useFetch(
    `${BOARD_COLUMNS_URL}`,
    {
      method: "PUT",
    },
    false
  );

  const { error: bulkCardUpdateError, dispatch: bulkCardUpdateRequest } =
    useFetch(
      `${COLUMN_CARDS_URL}/bulk`,
      {
        method: "PUT",
      },
      false
    );

  const { error: createCardError, dispatch: createCardRequest } = useFetch(
    `${COLUMN_CARDS_URL}`,
    {
      method: "POST",
    },
    false
  );

  // load board items on init
  useEffect(() => {
    if (!isBoardColumnsLoading && !loadColumnsError) {
      setBoardColumns(data?.items || []);
    }

    if (loadColumnsError) {
      setError(loadColumnsError);
    }

    setIsLoading(isBoardColumnsLoading);
  }, [loadColumnsError, isBoardColumnsLoading, data]);

  useEffect(() => {
    if (bulkColumnsUpdateError) {
      toast.error("An error occurred updating board data.", {
        pauseOnHover: true,
      });
    }
  }, [
    createColumnsError,
    loadColumnError,
    bulkColumnsUpdateError,
    columnUpdateError,
    bulkCardUpdateError,
    deleteColumnError,
    createCardError,
  ]);

  const addNewColumn = useCallback(async (): Promise<string> => {
    const createColumnPayload = {
      name: `new-column-${generateRandomStr(4)}`,
      description: `new-column-description-${generateRandomStr(24)}`,
      ordinal: calculateNextColumnOrdinal(boardColumns),
      boardId: boardColumns[0].boardId,
    };

    const response = await createColumnRequest({
      overrideOptions: {
        headers,
        body: JSON.stringify(createColumnPayload),
      },
    });

    return (response as { id: string }).id;
  }, [createColumnRequest, boardColumns]);

  const fetchColumn = useCallback(
    async (id: string): Promise<BoardColumn> => {
      const response = await fetchBoardColumn({
        overrideUrl: `${BOARD_COLUMNS_URL}/${id}`,
        overrideOptions: {
          headers,
        },
      });

      return response as BoardColumn;
    },
    [fetchBoardColumn]
  );

  const deleteColumn = useCallback(
    async (id: string): Promise<string | null> => {
      // ensure that at least one column is available on the board
      if (boardColumns.length > 1) {
        const response = await deleteColumnRequest({
          overrideUrl: `${BOARD_COLUMNS_URL}/${id}`,
        });

        return (response as { id: string }).id;
      }

      return null;
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

  const updateColumn = useCallback(
    async (column: BoardColumn) => {
      await columnUpdateRequest({
        overrideUrl: `${BOARD_COLUMNS_URL}/${column.id}`,
        overrideOptions: {
          headers,
          body: JSON.stringify(column),
        },
      });
    },
    [columnUpdateRequest]
  );

  const addNewCaseCard = useCallback(
    async (createCardPayload: Partial<ColumnCard>): Promise<ColumnCard> => {
      const payload = {
        ...createCardPayload,
        progress: getRandomNumber(5, 99),
      };

      const response = await createCardRequest({
        overrideOptions: {
          headers,
          body: JSON.stringify(payload),
        },
      });

      return response as ColumnCard;
    },
    [createCardRequest]
  );

  const updateCardsOrder = useCallback(
    async (cards: ColumnCard[]) => {
      const updateCardsPayload = cards.map((card, idx) => {
        const { id, boardColumnId } = card;

        return {
          id,
          ordinal: idx + 1,
          boardColumnId,
        };
      });

      await bulkCardUpdateRequest({
        overrideOptions: {
          headers,
          body: JSON.stringify(updateCardsPayload),
        },
      });
    },
    [bulkCardUpdateRequest]
  );

  const appState = useMemo(() => {
    return {
      ...defaultAppState,
      boardColumns,
      isLoading,
      error,
      fetchColumn,
      addNewColumn,
      deleteColumn,
      addNewCaseCard,
      updateColumnsOrder,
      updateColumn,
      updateCardsOrder,
    };
  }, [
    isLoading,
    boardColumns,
    error,
    fetchColumn,
    addNewColumn,
    deleteColumn,
    addNewCaseCard,
    updateColumnsOrder,
    updateColumn,
    updateCardsOrder,
  ]);

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};
