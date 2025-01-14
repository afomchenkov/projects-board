import { useEffect, useRef, useState, memo, useCallback } from "react";
import Modal from "react-modal";
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
import CrossIcon from "@atlaskit/icon/glyph/cross";
import { BoardColumn, ColumnCard } from "../../types";
import { Card } from "./Card";
import { AddCardForm, AddCardFormData } from "../forms/AddCardForm";
import { useAppContext } from "../../state";
import { useEscapeKey } from "../../hooks";
import { calculateNextCardOrdinal } from "../../utils";
import { ColumnHeader } from "./ColumnHeader";
import "./Column.scss";

const createCardModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: 0,
    borderRadius: "3px",
    transform: "translate(-50%, -50%)",
    maxWidth: "25em",
  },
  overlay: {
    zIndex: 999,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
};

export type ColumnType = (props: {
  column: BoardColumn;
  onColumnDelete: (id: string) => void;
  onCardAdd: (card: ColumnCard) => void;
}) => React.JSX.Element;

export const Column = memo<ColumnType>(
  ({ column, onColumnDelete, onCardAdd }) => {
    const { id: columnId, columnCards = [] } = column || {};

    const columnRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const cardListRef = useRef<HTMLDivElement | null>(null);

    const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const [isCreateCaseModalOpened, setIsCreateCaseModalOpened] =
      useState(false);

    const { addNewCaseCard } = useAppContext();

    useEscapeKey(() => {
      setIsCreateCaseModalOpened(false);
    });

    const handleNewCaseCreateClick = () => {
      setIsCreateCaseModalOpened(true);
    };

    const handleNewCaseCreateSubmit = useCallback(
      async (data: AddCardFormData) => {
        setIsCreateCaseModalOpened(false);

        const newCard = await addNewCaseCard({
          ...data,
          boardColumnId: columnId,
          ordinal: calculateNextCardOrdinal(columnCards),
        });

        onCardAdd(newCard);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    const handleModalClose = () => {
      setIsCreateCaseModalOpened(false);
    };

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
            setClosestEdge(null);
          },
          onDrop: (args) => {
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
        <ColumnHeader
          ref={headerRef}
          column={column}
          onColumnDelete={onColumnDelete}
        />

        <div className="app-board-column--scroll-container">
          <div className="app-board-column--card-list" ref={cardListRef}>
            {columnCards.map((card) => (
              <Card columnCard={card} key={card.id} />
            ))}
          </div>
        </div>

        <DropIndicator edge={closestEdge} gap={16} />
        <Button onClick={handleNewCaseCreateClick}>Create Case</Button>

        <Modal
          isOpen={isCreateCaseModalOpened}
          ariaHideApp={false}
          style={createCardModalStyles}
        >
          <section className="app-board-column__modal">
            <div className="app-board-column__modal-header">
              <h3>Add new column card</h3>
              <IconButton
                icon={CrossIcon}
                label="Close Modal"
                appearance="subtle"
                onClick={handleModalClose}
              />
            </div>
            <AddCardForm onFormSubmit={handleNewCaseCreateSubmit} />
          </section>
        </Modal>
      </div>
    );
  }
);
