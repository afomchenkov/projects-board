import { useEffect, useRef, useState, memo } from "react";
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from "@atlaskit/drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/drag-and-drop-indicator";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/drag-and-drop/adapter/element";
import { combine } from "@atlaskit/drag-and-drop/util/combine";
import { BoardColumn } from "../../types";
import { Card } from "./Card";
import "./Column.scss";

export const Column = memo(({ column }: { column: BoardColumn }) => {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardListRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const columnId = column.id;

  const handleAddNewColumn = () => {};

  useEffect(() => {
    return combine(
      draggable({
        element: columnRef.current!,
        dragHandle: headerRef.current!,
        getInitialData: () => ({ columnId, type: "column" }),
      }),
      dropTargetForElements({
        element: cardListRef.current!,
        getData: () => ({ columnId }),
        canDrop: (args) => args.source.data.type === "card",
        getIsSticky: () => true,
        onDragEnter: () => setIsDraggingOver(true),
        onDragLeave: () => setIsDraggingOver(false),
        onDragStart: () => setIsDraggingOver(true),
        onDrop: () => setIsDraggingOver(false),
      }),
      dropTargetForElements({
        element: columnRef.current!,
        canDrop: (args) => args.source.data.type === "column",
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = {
            columnId,
          };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["left", "right"],
          });
        },
        onDragEnter: (args) => {
          setClosestEdge(extractClosestEdge(args.self.data));
        },
        onDrag: (args) => {
          setClosestEdge(extractClosestEdge(args.self.data));
        },
        onDragLeave: (args) => {
          console.log('on darg leave ', args, args.self);
          setClosestEdge(null);
        },
        onDrop: (args) => {
          console.log('on darg drop ', args, args.self);
          setClosestEdge(null);
        },
      })
    );
  }, [columnId]);

  return (
    <div
      className={`app-board-column ${isDraggingOver ? "--is-column-dragging-over" : ""}`}
      ref={columnRef}
    >
      <div
        className="app-board-column--header"
        ref={headerRef}
        data-testid={`column-${columnId}`}
      >
        <h6 className="app-board-column--title">{column.name}</h6>
        <span className="app-board-column--title">ID: {columnId}</span>
        <button onClick={handleAddNewColumn}>...</button>
      </div>
      <div className="app-board-column--scroll-container">
        <div className="app-board-column--card-list" ref={cardListRef}>
          {column.columnCards.map((card) => (
            <Card columnCard={card} key={card.id} />
          ))}
        </div>
      </div>
      <DropIndicator edge={closestEdge} gap={16} />
      <button>+ Create Case</button>
    </div>
  );
});
