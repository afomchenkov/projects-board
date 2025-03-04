import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Edge } from "@atlaskit/drag-and-drop-hitbox/types";
import { extractClosestEdge } from "@atlaskit/drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/drag-and-drop-hitbox/reorder-with-edge";
import { monitorForElements } from "@atlaskit/drag-and-drop/adapter/element";
import { combine } from "@atlaskit/drag-and-drop/util/combine";
// https://atlassian.design/components/pragmatic-drag-and-drop/core-package/utilities/
import { IconButton } from "@atlaskit/button/new";
import AddIcon from "@atlaskit/icon/glyph/add";
import { useAppContext } from "../../state/appContext";
import { getInitialData, reorderColumns } from "../../utils";
import { Column } from "./Column";
import {
  BoardColumn,
  BoardState,
  BoardActionType,
  BoardColumnsMap,
  ColumnCard,
} from "../../types";
import "./Board.scss";

export type BoardType = (props: {
  columns: BoardColumn[];
}) => React.JSX.Element;

const Board: BoardType = ({ columns }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [boardData, setBoardData] = useState<BoardState>(() =>
    getInitialData(columns)
  );
  const { addNewColumn, fetchColumn, updateColumnsOrder, updateCardsOrder } =
    useAppContext();

  const handleColumnAdd = useCallback(async () => {
    const newColumnId = await addNewColumn();

    if (newColumnId) {
      const newColumn = await fetchColumn(newColumnId);

      setBoardData((state) => {
        const newState = { ...state };

        if (!newState.columnMap[newColumnId]) {
          newState.columnMap[newColumnId] = newColumn;
          newState.orderedColumnIds.push(newColumnId);
          newState.columnsOnAppLoad.push(newColumn);
        }

        return newState;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleColumnDelete = useCallback((id: string) => {
    setBoardData((state) => {
      const newState = { ...state };
      if (newState.columnMap[id]) {
        const columnIndex = newState.columnsOnAppLoad.findIndex(
          (column) => column.id === id
        );
        newState.columnsOnAppLoad.splice(columnIndex, 1);
        delete newState.columnMap[id];
        const columnIdIndex = newState.orderedColumnIds.findIndex(
          (columnId) => columnId === id
        );
        newState.orderedColumnIds.splice(columnIdIndex, 1);
      }

      return newState;
    });
  }, []);

  const handleCardAdd = useCallback((card: ColumnCard) => {
    setBoardData((state) => {
      const sourceColumn = state.columnMap[card.boardColumnId];
      const updatedSourceColumn: BoardColumn = {
        ...sourceColumn,
        columnCards: [...sourceColumn.columnCards, card],
      };

      return {
        ...state,
        columnMap: {
          ...state.columnMap,
          [sourceColumn.id]: updatedSourceColumn,
        },
      };
    });
  }, []);

  // dispatch sync BE requests on cards/columns reorder to sync ordinals
  useEffect(() => {
    const { actionType, cardOrderUpdateAction } = boardData;

    switch (actionType) {
      case BoardActionType.ChangeColumnsOrder: {
        updateColumnsOrder(reorderColumns(boardData));
        break;
      }
      case BoardActionType.ChangeCardsOrder: {
        if (cardOrderUpdateAction) {
          const { columnCards } =
            boardData.columnMap[cardOrderUpdateAction.sourceColumnId] || {};

          if (columnCards) {
            updateCardsOrder(columnCards);
          }
        }
        break;
      }
      case BoardActionType.MoveCardToAnotherColumn: {
        if (cardOrderUpdateAction) {
          const { destinationColumnId } = cardOrderUpdateAction;
          const { columnCards } =
            boardData.columnMap[destinationColumnId] || {};

          if (columnCards) {
            updateCardsOrder(
              columnCards.map((card) => {
                card.boardColumnId = destinationColumnId;
                return card;
              })
            );
          }
        }
        break;
      }
      case BoardActionType.None:
        break;
      default: {
        console.warn("Board action type is not recognized.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

            // find target column and destibation column, trigger reordering with edge
            const reorderedColumnsIds = reorderWithEdge({
              list: boardData.orderedColumnIds,
              startIndex,
              finishIndex,
              edge,
              axis: "horizontal",
            });

            // on column drag end we save the state of the board
            setBoardData({
              ...boardData,
              orderedColumnIds: reorderedColumnsIds,
              actionType: BoardActionType.ChangeColumnsOrder,
              cardOrderUpdateAction: null,
            });
          }

          // handle drag/drop a card
          if (source.data.type === "card") {
            const cardId = source.data.cardId;

            // find source column to which card belongs to now
            const [, startColumnRecord] = location.initial.dropTargets;
            const sourceId = startColumnRecord.data.columnId as string;

            const sourceColumn = boardData.columnMap[sourceId];
            const cardIndex = sourceColumn.columnCards.findIndex(
              (card) => card.id === cardId
            );
            // find source card which we want to drag
            const columnCardByIndex: ColumnCard =
              sourceColumn.columnCards[cardIndex];

            if (location.current.dropTargets.length === 1) {
              // find destination column, on which the card lands
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
        return (
          <Column
            column={boardData.columnMap[columnId]}
            key={columnId}
            onColumnDelete={handleColumnDelete}
            onCardAdd={handleCardAdd}
          />
        );
      })}
      <IconButton
        icon={AddIcon}
        label="Add New Column"
        onClick={handleColumnAdd}
      />
    </div>
  );
};

export default Board;
