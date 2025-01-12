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

  // reload columns after column delete/create or new card create
  useEffect(() => {
    const fetchError =
      deleteColumnsError || createColumnsError || createCardError;
    if (fetchError) {
      setError(fetchError);
    }

    const shouldReloadBoardColumns =
      !isDeleteBoardColumnsLoading &&
      !isCreateBoardColumnsLoading &&
      !isCreateCardLoading;
    if (shouldReloadBoardColumns) {
      fetchBoardColumns();
    }
  }, [
    isCreateCardLoading,
    isCreateBoardColumnsLoading,
    isDeleteBoardColumnsLoading,
    createColumnsError,
    deleteColumnsError,
    createCardError,
    fetchBoardColumns,
  ]);

  useEffect(() => {
    if (bulkColumnsUpdateError) {
      toast.error("Error occurred while updating the columns", {
        pauseOnHover: true,
      });
    }

    if (columnUpdateError) {
      toast.error("Error occurred while updating the column data", {
        pauseOnHover: true,
      });
    }

    if (bulkCardUpdateError) {
      toast.error("Error occurred while updating the cards", {
        pauseOnHover: true,
      });
    }
  }, [bulkColumnsUpdateError, columnUpdateError, bulkCardUpdateError]);

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

      const response = await bulkColumnsUpdateRequest({
        overrideOptions: {
          headers,
          body: JSON.stringify(updatePayload),
        },
      });

      if (response) {
        toast.success("Columns have been updated", {
          autoClose: 2000,
        });
      }
    },
    [bulkColumnsUpdateRequest]
  );

  const updateColumn = useCallback(
    async (column: BoardColumn) => {
      const response = await columnUpdateRequest({
        overrideUrl: `${BOARD_COLUMNS_URL}/${column.id}`,
        overrideOptions: {
          headers,
          body: JSON.stringify(column),
        },
      });

      if (response) {
        toast.success(`Column updated: ${(response as BoardColumn).name}`, {
          autoClose: 2000,
          pauseOnHover: true,
        });
      }
    },
    [columnUpdateRequest]
  );

  const addNewCaseCard = useCallback(
    async (createCardPayload: Partial<ColumnCard>) => {
      const payload = {
        ...createCardPayload,
        progress: getRandomNumber(5, 99),
      };

      await createCardRequest({
        overrideOptions: {
          headers,
          body: JSON.stringify(payload),
        },
      });
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

      const cardsUpdateResponse = await bulkCardUpdateRequest({
        overrideOptions: {
          headers,
          body: JSON.stringify(updateCardsPayload),
        },
      });

      if (cardsUpdateResponse) {
        toast.success("Cards have been updated", {
          autoClose: 2000,
        });
      }
    },
    [bulkCardUpdateRequest]
  );

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
      updateColumn,
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
    updateColumn,
    updateCardsOrder,
  ]);

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};
