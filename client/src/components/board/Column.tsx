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
import { IconButton } from "@atlaskit/button/new";
import Button from "@atlaskit/button/new";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import EditIcon from "@atlaskit/icon/glyph/edit";
import { BoardColumn } from "../../types";
import { Card } from "./Card";
import { useAppContext } from "../../state/appContext";
import "./Column.scss";

export const Column = memo(({ column }: { column: BoardColumn }) => {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardListRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const { deleteColumn } = useAppContext();

  const columnId = column.id;

  const handleColumnDeleteClick = () => {
    deleteColumn(columnId);
  };

  const handleNewCaseCreate = () => {
    console.log("Case create clicked: ", columnId);
  }

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
          console.log("on darg leave ", args, args.self);
          setClosestEdge(null);
        },
        onDrop: (args) => {
          console.log("on darg drop ", args, args.self);
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
        <div className="app-board-column--title-container">
          <span className="app-board-column--title">{column.name}</span>
          <IconButton
            icon={() => <EditIcon size="small" label="Edit" />}
            appearance="subtle"
            label="Edit Title"
          />
        </div>
        <IconButton
          icon={TrashIcon}
          label="Delete Column"
          appearance="subtle"
          onClick={handleColumnDeleteClick}
        />
      </div>
      <div className="app-board-column--scroll-container">
        <div className="app-board-column--card-list" ref={cardListRef}>
          {column.columnCards.map((card) => (
            <Card columnCard={card} key={card.id} />
          ))}
        </div>
      </div>
      <DropIndicator edge={closestEdge} gap={16} />
      <Button onClick={handleNewCaseCreate}>Create Case</Button>
    </div>
  );
});
