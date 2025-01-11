import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Edge } from "@atlaskit/drag-and-drop-hitbox/types";
import { extractClosestEdge } from "@atlaskit/drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/drag-and-drop-hitbox/reorder-with-edge";
import { monitorForElements } from "@atlaskit/drag-and-drop/adapter/element";
import { combine } from "@atlaskit/drag-and-drop/util/combine";
import { IconButton } from "@atlaskit/button/new";
import AddIcon from "@atlaskit/icon/glyph/add";
import { Column } from "./Column";
import { BoardColumn, BoardColumnsMap, ColumnCard } from "../../types";
import { useAppContext } from "../../state/appContext";
import { getRandomNumber } from "../../utils";
import "./Board.scss";

type CardOrderUpdateAction = {
  sourceColumnId: string;
  destinationColumnId: string;
  startIndex: number;
  destinationIndex: number;
};

type BoardState = {
  columnMap: BoardColumnsMap;
  columnsOnAppLoad: BoardColumn[];
  orderedColumnIds: string[];
  actionType: BoardActionType;
  cardOrderUpdateAction: CardOrderUpdateAction | null;
};

enum BoardActionType {
  ChangeColumnsOrder = "ChangeColumnsOrder",
  ChangeCardsOrder = "ChangeCardsOrder",
  MoveCardToAnotherColumn = "MoveCardToAnotherColumn",
  None = "None",
}

export const getInitialData = (boardColumns: BoardColumn[] = []) => {
  // order columns by ordinal sequence
  const columnsOnAppLoad = [...boardColumns].sort(
    (a, b) => a.ordinal - b.ordinal
  );
  const orderedColumnIds = columnsOnAppLoad.map((column) => column.id);

  const columnMap = boardColumns.reduce((acc, column) => {
    acc[column.id] = column;

    column.columnCards.sort((a, b) => a.ordinal - b.ordinal);

    column.columnCards.forEach((card) => {
      card.progress = getRandomNumber(0, 99);
    });

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

const reorderColumns = (boardData: BoardState) => {
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

const reorderCardsSameColumn = (
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

const reorderCardsDifferentColumn = (
  columnId: string,
  cards: ColumnCard[]
) => {};

export type BoardType = (props: {
  columns: BoardColumn[];
}) => React.JSX.Element;

const Board: BoardType = ({ columns }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [boardData, setBoardData] = useState<BoardState>(() =>
    getInitialData(columns)
  );
  const { addNewColumn, updateColumnsOrder, updateCardsOrder } =
    useAppContext();

  const handleAddNewColumn = useCallback(() => {
    addNewColumn();
  }, [addNewColumn]);

  useEffect(() => {
    const { actionType, cardOrderUpdateAction } = boardData;

    switch (actionType) {
      case BoardActionType.ChangeColumnsOrder: {
        updateColumnsOrder(reorderColumns(boardData));
        break;
      }
      case BoardActionType.ChangeCardsOrder: {
        if (cardOrderUpdateAction) {
          const { columnCards } = boardData.columnMap[cardOrderUpdateAction.sourceColumnId];
          updateCardsOrder(columnCards);
        }
        break;
      }
      case BoardActionType.MoveCardToAnotherColumn: {
        if (cardOrderUpdateAction) {
          const { destinationColumnId } = cardOrderUpdateAction;
          const { columnCards } = boardData.columnMap[destinationColumnId];
          
          updateCardsOrder(columnCards.map((card) => {
            card.boardColumnId = destinationColumnId; 
            return card;
          }))
        }
        break;
      }
      default:
        console.warn("Board action type is not recognized.");
    }
  }, [boardData]);

  useEffect(() => {
    return combine(
      monitorForElements({
        onDrop(args) {
          const { location, source } = args;
          // didn't drop on anything
          if (!location.current.dropTargets.length) {
            return;
          }

          // Drag/Drop a column, need to handle drop
          // 1. remove element from original position
          // 2. move to new position
          if (source.data.type === "column") {
            const startIndex: number = boardData.orderedColumnIds.findIndex(
              (columnId) => columnId === source.data.columnId
            );

            const target = location.current.dropTargets[0];
            const finishIndex: number = boardData.orderedColumnIds.findIndex(
              (id) => id === target.data.columnId
            );
            const edge: Edge | null = extractClosestEdge(target.data);

            const reorderedColumnsIds = reorderWithEdge({
              list: boardData.orderedColumnIds,
              startIndex,
              finishIndex,
              edge,
              axis: "horizontal",
            });

            // on column drag end
            setBoardData({
              ...boardData,
              orderedColumnIds: reorderedColumnsIds,
              actionType: BoardActionType.ChangeColumnsOrder,
              cardOrderUpdateAction: null,
            });
          }

          // Drag/Drop a card
          if (source.data.type === "card") {
            const cardId = source.data.cardId;

            // TODO: these lines not needed if item has columnId on it
            const [, startColumnRecord] = location.initial.dropTargets;
            const sourceId = startColumnRecord.data.columnId as string;

            const sourceColumn = boardData.columnMap[sourceId];
            const cardIndex = sourceColumn.columnCards.findIndex(
              (card) => card.id === cardId
            );
            const columnCardByIndex: ColumnCard =
              sourceColumn.columnCards[cardIndex];

            if (location.current.dropTargets.length === 1) {
              const [destinationColumnRecord] = location.current.dropTargets;
              const destinationId = destinationColumnRecord.data
                .columnId as string;
              const destinationColumn = boardData.columnMap[destinationId];

              // reordering in same column
              if (sourceColumn === destinationColumn) {
                const updated = reorderWithEdge({
                  list: sourceColumn.columnCards,
                  startIndex: cardIndex,
                  finishIndex: sourceColumn.columnCards.length - 1,
                  edge: null,
                  axis: "vertical",
                });
                const updatedMap: BoardColumnsMap = {
                  ...boardData.columnMap,
                  [sourceColumn.id]: {
                    ...sourceColumn,
                    columnCards: updated,
                  },
                };
                const destinationIndex = updatedMap[
                  destinationColumn.id
                ].columnCards.findIndex((i) => i.id === cardId);

                // moving card to end position in same column
                setBoardData({
                  ...boardData,
                  columnMap: updatedMap,
                  actionType: BoardActionType.ChangeCardsOrder,
                  cardOrderUpdateAction: {
                    sourceColumnId: sourceColumn.id,
                    destinationColumnId: destinationColumn.id,
                    startIndex: cardIndex,
                    destinationIndex,
                  },
                });

                return;
              }

              // moving to a new column
              const updatedMap: BoardColumnsMap = {
                ...boardData.columnMap,
                [sourceColumn.id]: {
                  ...sourceColumn,
                  columnCards: sourceColumn.columnCards.filter(
                    (card) => card.id !== cardId
                  ),
                },
                [destinationColumn.id]: {
                  ...destinationColumn,
                  columnCards: [
                    ...destinationColumn.columnCards,
                    columnCardByIndex,
                  ],
                },
              };
              const destinationIndex = updatedMap[
                destinationColumn.id
              ].columnCards.findIndex((i) => i.id === cardId);

              // moving card to end position of another column
              setBoardData({
                ...boardData,
                columnMap: updatedMap,
                actionType: BoardActionType.MoveCardToAnotherColumn,
                cardOrderUpdateAction: {
                  sourceColumnId: sourceColumn.id,
                  destinationColumnId: destinationColumn.id,
                  startIndex: cardIndex,
                  destinationIndex,
                },
              });
              return;
            }

            // dropping in a column (relative to a card)
            if (location.current.dropTargets.length === 2) {
              const [destinationCardRecord, destinationColumnRecord] =
                location.current.dropTargets;
              const destinationColumnId = destinationColumnRecord.data
                .columnId as string;
              const destinationColumn =
                boardData.columnMap[destinationColumnId];

              const finishIndex = destinationColumn.columnCards.findIndex(
                (item) => item.id === destinationCardRecord.data.cardId
              );
              const edge: Edge | null = extractClosestEdge(
                destinationCardRecord.data
              );

              // case 1: ordering in the same column
              if (sourceColumn === destinationColumn) {
                const updated = reorderWithEdge({
                  list: sourceColumn.columnCards,
                  startIndex: cardIndex,
                  finishIndex,
                  edge,
                  axis: "vertical",
                });
                const updatedSourceColumn: BoardColumn = {
                  ...sourceColumn,
                  columnCards: updated,
                };
                const updatedMap: BoardColumnsMap = {
                  ...boardData.columnMap,
                  [sourceColumn.id]: updatedSourceColumn,
                };
                const destinationIndex = updatedMap[
                  destinationColumn.id
                ].columnCards.findIndex((i) => i.id === cardId);

                // dropping relative to card in the same column
                setBoardData({
                  ...boardData,
                  columnMap: updatedMap,
                  actionType: BoardActionType.ChangeCardsOrder,
                  cardOrderUpdateAction: {
                    sourceColumnId: sourceColumn.id,
                    destinationColumnId: destinationColumn.id,
                    startIndex: cardIndex,
                    destinationIndex,
                  },
                });

                return;
              }

              // case 2: moving into a new column relative to a card
              const updatedSourceColumn: BoardColumn = {
                ...sourceColumn,
                columnCards: sourceColumn.columnCards.filter(
                  (card) => card.id !== columnCardByIndex.id
                ),
              };
              const updated: ColumnCard[] = Array.from(
                destinationColumn.columnCards
              );
              const destinationIndex =
                edge === "bottom" ? finishIndex + 1 : finishIndex;
              updated.splice(destinationIndex, 0, columnCardByIndex);

              const updatedDestinationColumn: BoardColumn = {
                ...destinationColumn,
                columnCards: updated,
              };
              const updatedMap: BoardColumnsMap = {
                ...boardData.columnMap,
                [sourceColumn.id]: updatedSourceColumn,
                [destinationColumn.id]: updatedDestinationColumn,
              };

              // dropping on a card in different column
              setBoardData({
                ...boardData,
                columnMap: updatedMap,
                actionType: BoardActionType.MoveCardToAnotherColumn,
                cardOrderUpdateAction: {
                  sourceColumnId: sourceColumn.id,
                  destinationColumnId: destinationColumn.id,
                  startIndex: cardIndex,
                  destinationIndex,
                },
              });
            }
          }
        },
      })
    );
  }, [boardData]);

  return (
    <div className="app-board" ref={ref}>
      {boardData.orderedColumnIds.map((columnId) => {
        return <Column column={boardData.columnMap[columnId]} key={columnId} />;
      })}
      <IconButton
        icon={AddIcon}
        label="Add New Column"
        onClick={handleAddNewColumn}
      />
    </div>
  );
};

export default Board;
