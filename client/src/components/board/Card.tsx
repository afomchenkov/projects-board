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
import "./Card.scss";

type DraggableState = "idle" | "preview" | "dragging";

const stateText: { [State in DraggableState]: string } = {
  preview: "Drag preview",
  idle: "Draggable",
  dragging: "Draggable source",
};

export const Card = memo(
  ({ columnCard }: { columnCard: ColumnCard }): React.JSX.Element => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const [state, setState] = useState<DraggableState>("idle");
    const cardId = columnCard.id;

    useEffect(() => {
      console.log("recreating draggable");

      return combine(
        draggable({
          element: ref.current!,
          getInitialData: () => ({ type: "card", cardId }),
          onGenerateDragPreview: ({ source }) => {
            scrollJustEnoughIntoView({ element: source.element });
            setState("preview");
          },
          onDragStart: () => setState("dragging"),
          onDrop: () => setState("idle"),
        }),
        dropTargetForFiles({
          element: ref.current!,
        }),
        dropTargetForElements({
          element: ref.current!,
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
          onDragLeave: (args) => {
            setClosestEdge(null);
          },
          onDrop: (args) => {
            setClosestEdge(null);
          },
        })
      );
    }, [cardId]);

    return (
      <div
        className="app-board-card"
        ref={ref}
        data-testid={`card-${cardId}`}
        data-card-state={`${stateText[state]}`}
      >
        <span className="app-board-card__id">ID: {cardId}</span>
        {/** <CardText state={state} /> */}
        <DropIndicator edge={closestEdge} gap={8} />
      </div>
    );
  }
);
