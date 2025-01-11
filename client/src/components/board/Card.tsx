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
import { dropTargetForFiles } from "@atlaskit/drag-and-drop/adapter/file";
import { combine } from "@atlaskit/drag-and-drop/util/combine";
import { scrollJustEnoughIntoView } from "@atlaskit/drag-and-drop/util/scroll-just-enough-into-view";
import { ColumnCard } from "../../types";
import { parseUpdatedAt } from "../../utils";
import "./Card.scss";

type DraggableState = "idle" | "preview" | "dragging";

const stateText: { [State in DraggableState]: string } = {
  preview: "Drag preview",
  idle: "Draggable",
  dragging: "Draggable source",
};

export type CardType = (props: { columnCard: ColumnCard }) => React.JSX.Element;

export const Card = memo<CardType>(
  ({ columnCard: { id: cardId, name, progress, updatedAt } }) => {
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const [state, setState] = useState<DraggableState>("idle");
    const cardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      return combine(
        draggable({
          element: cardRef.current!,
          getInitialData: () => ({ type: "card", cardId }),
          onGenerateDragPreview: ({ source }) => {
            scrollJustEnoughIntoView({ element: source.element });
            setState("preview");
          },
          onDragStart: () => setState("dragging"),
          onDrop: () => setState("idle"),
        }),
        dropTargetForFiles({
          element: cardRef.current!,
        }),
        dropTargetForElements({
          element: cardRef.current!,
          canDrop: (args) => args.source.data.type === "card",
          getIsSticky: () => true,
          getData: ({ input, element }) => {
            const data = { type: "card", cardId };

            return attachClosestEdge(data, {
              input,
              element,
              allowedEdges: ["top", "bottom"],
            });
          },
          onDragEnter: (args) => {
            if (args.source.data.cardId !== cardId) {
              setClosestEdge(extractClosestEdge(args.self.data));
            }
          },
          onDrag: (args) => {
            if (args.source.data.cardId !== cardId) {
              setClosestEdge(extractClosestEdge(args.self.data));
            }
          },
          onDragLeave: (_args) => {
            setClosestEdge(null);
          },
          onDrop: (_args) => {
            setClosestEdge(null);
          },
        })
      );
    }, [cardId]);

    return (
      <div
        className="app-board-card"
        ref={cardRef}
        data-testid={`card-${cardId}`}
        data-card-state={`${stateText[state]}`}
      >
        <h3 className="app-board-card__text">{name}</h3>
        <div className="app-board-card__progress-container">
          <div
            className="app-board-card__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="app-board-card__date">
          {parseUpdatedAt(updatedAt)}
        </span>
        <DropIndicator edge={closestEdge} gap={8} />
      </div>
    );
  }
);
