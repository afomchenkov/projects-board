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
import "./Board.scss";

export const getInitialData = (boardColumns: BoardColumn[] = []) => {
  // order columns by ordinal sequence
  const orderedColumns = [...boardColumns].sort(
    (a, b) => a.ordinal - b.ordinal
  );
  const orderedColumnIds = orderedColumns.map((column) => column.id);

  // TODO: order cards?
  const columnMap = boardColumns.reduce((acc, column) => {
    acc[column.id] = column;
    return acc;
  }, {} as BoardColumnsMap);

  return { columnMap, orderedColumns, orderedColumnIds };
};

type BoardType = (props: {
  columns: BoardColumn[];
  // onColumnCreate: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => React.JSX.Element;

const Board: BoardType = ({ columns }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<{
    columnMap: BoardColumnsMap;
    orderedColumns: BoardColumn[];
    orderedColumnIds: string[];
  }>(() => getInitialData(columns));
  const { addNewColumn } = useAppContext();

  const handleAddNewColumn = useCallback(() => {
    addNewColumn();
  }, [addNewColumn]);

  useEffect(() => {
    return combine(
      monitorForElements({
        onDrop(args) {
          const { location, source } = args;
          // didn't drop on anything
          if (!location.current.dropTargets.length) {
            return;
          }

          // need to handle drop
          // 1. remove element from original position
          // 2. move to new position
          if (source.data.type === "column") {
            const startIndex: number = data.orderedColumnIds.findIndex(
              (columnId) => columnId === source.data.columnId
            );

            const target = location.current.dropTargets[0];
            const finishIndex: number = data.orderedColumnIds.findIndex(
              (id) => id === target.data.columnId
            );
            const edge: Edge | null = extractClosestEdge(target.data);

            const updated = reorderWithEdge({
              list: data.orderedColumnIds,
              startIndex,
              finishIndex,
              edge,
              axis: "horizontal",
            });

            // ON COLUMN DARG END
            console.log("reordering column", {
              startIndex,
              destinationIndex: updated.findIndex(
                (columnId) => columnId === target.data.columnId
              ),
              edge,
            });

            setData({ ...data, orderedColumnIds: updated });
          }

          // Dragging a card
          if (source.data.type === "card") {
            const cardId = source.data.cardId;

            // TODO: these lines not needed if item has columnId on it
            const [, startColumnRecord] = location.initial.dropTargets;
            const sourceId = startColumnRecord.data.columnId as string;

            const sourceColumn = data.columnMap[sourceId];
            const cardIndex = sourceColumn.columnCards.findIndex(
              (card) => card.id === cardId
            );
            const columnCardByIndex: ColumnCard =
              sourceColumn.columnCards[cardIndex];

            if (location.current.dropTargets.length === 1) {
              const [destinationColumnRecord] = location.current.dropTargets;
              const destinationId = destinationColumnRecord.data
                .columnId as string;
              const destinationColumn = data.columnMap[destinationId];

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
                  ...data.columnMap,
                  [sourceColumn.id]: {
                    ...sourceColumn,
                    columnCards: updated,
                  },
                };
                setData({ ...data, columnMap: updatedMap });
                console.log("moving card to end position in same column", {
                  startIndex: cardIndex,
                  destinationIndex: updated.findIndex((i) => i.id === cardId),
                  edge: null,
                });
                return;
              }

              // moving to a new column
              const updatedMap: BoardColumnsMap = {
                ...data.columnMap,
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

              setData({ ...data, columnMap: updatedMap });
              console.log("moving card to end position of another column", {
                startIndex: cardIndex,
                destinationIndex: updatedMap[
                  destinationColumn.id
                ].columnCards.findIndex((i) => i.id === cardId),
                edge: null,
              });
              return;
            }

            // dropping in a column (relative to a card)
            if (location.current.dropTargets.length === 2) {
              const [destinationCardRecord, destinationColumnRecord] =
                location.current.dropTargets;
              const destinationColumnId = destinationColumnRecord.data
                .columnId as string;
              const destinationColumn = data.columnMap[destinationColumnId];

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
                  ...data.columnMap,
                  [sourceColumn.id]: updatedSourceColumn,
                };
                console.log("dropping relative to card in the same column", {
                  startIndex: cardIndex,
                  destinationIndex: updated.findIndex((i) => i.id === cardId),
                  edge,
                });
                setData({ ...data, columnMap: updatedMap });
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
                ...data.columnMap,
                [sourceColumn.id]: updatedSourceColumn,
                [destinationColumn.id]: updatedDestinationColumn,
              };
              console.log("dropping on a card in different column", {
                sourceColumn: sourceColumn.id,
                destinationColumn: destinationColumn.id,
                startIndex: cardIndex,
                destinationIndex,
                edge,
              });
              setData({ ...data, columnMap: updatedMap });
            }
          }
        },
      })
    );
  }, [data]);

  return (
    <div className="app-board" ref={ref}>
      {data.orderedColumnIds.map((columnId) => {
        return <Column column={data.columnMap[columnId]} key={columnId} />;
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
