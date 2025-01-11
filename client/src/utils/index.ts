import { format, toDate, differenceInDays, parseISO } from "date-fns";
import {
  BoardColumn,
  BoardState,
  BoardColumnsMap,
  BoardActionType,
  CardOrderUpdateAction,
  ColumnCard
} from "../types";

const DATE_FORMAT = "MM/dd/yyyy";

export const formatDate = (date: string) => format(toDate(date), DATE_FORMAT);

export const daysFromNow = (date: string) => {
  const givenDate = parseISO(date);
  const now = new Date();
  return differenceInDays(now, givenDate);
}

export const toDashedLowerCase = (str: string) => str.toLowerCase().replace(' ', '-');

export const capitalize = (str: string) => {
  return str.charAt(0).toLocaleUpperCase() + str.substring(1);
};

export const parseDateString = (date: string) => new Date(date).toUTCString();

export const Noop = () => { };

export const generateRandomStr = (length: number): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;

  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

export const calculateNextColumnOrdinal = (columns: BoardColumn[]) => {
  const ordinals = columns.map((column) => column.ordinal);
  ordinals.sort((a, b) => a - b);
  return (ordinals.at(-1) || 0) + 1;
};

export const calculateNextCardOrdinal = (columnCards: ColumnCard[]): number => {
  let nextIndex = 0;

  for (const card of columnCards) {
    nextIndex = Math.max(card.ordinal, nextIndex);
  }

  return nextIndex + 1;
};

export const parseUpdatedAt = (date: string): string => {
  const days = daysFromNow(date);

  if (days === 0) {
    return "Updated today";
  }

  if (days === 1) {
    return "Updated 1 day ago";
  }

  return `Updated ${days} days ago`;
};

export const getInitialData = (boardColumns: BoardColumn[] = []) => {
  // order columns by ordinal sequence
  const columnsOnAppLoad = [...boardColumns].sort(
    (a, b) => a.ordinal - b.ordinal
  );
  const orderedColumnIds = columnsOnAppLoad.map((column) => column.id);

  const columnMap = boardColumns.reduce((acc, column) => {
    acc[column.id] = column;

    column.columnCards.sort((a, b) => a.ordinal - b.ordinal);

    return acc;
  }, {} as BoardColumnsMap);

  return {
    columnMap,
    columnsOnAppLoad,
    orderedColumnIds,
    actionType: BoardActionType.None,
    cardOrderUpdateAction: null,
  };
};

export const reorderColumns = (boardData: BoardState) => {
  const { columnsOnAppLoad, orderedColumnIds } = boardData;
  const reorderedColumns: BoardColumn[] = [];

  orderedColumnIds.forEach((columnId, idx) => {
    const column = columnsOnAppLoad.find((column) => column.id === columnId);

    if (column) {
      reorderedColumns.push({ ...column, ordinal: idx + 1 });
    }
  });

  return reorderedColumns;
};

export const reorderCardsSameColumn = (
  cards: ColumnCard[],
  updateAction: CardOrderUpdateAction
) => {
  const cardsToUpdate: ColumnCard[] = [...cards];
  const { startIndex, destinationIndex } = updateAction;
  // move  card to a new position
  const [movedCard] = cardsToUpdate.splice(startIndex, 1);
  cardsToUpdate.splice(destinationIndex, 0, movedCard);
  // update ordinal index
  return cardsToUpdate.map((card, idx) => {
    card.ordinal = idx + 1;
    return card;
  });
};
