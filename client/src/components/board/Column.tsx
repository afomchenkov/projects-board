import { useCallback, useEffect, useRef, useState, memo } from "react";
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
import TrashIcon from "@atlaskit/icon/glyph/trash";
import CrossIcon from "@atlaskit/icon/glyph/cross";
import EditIcon from "@atlaskit/icon/glyph/edit";
import { BoardColumn, ColumnCard } from "../../types";
import { Card } from "./Card";
import { AddCardForm, AddCardFormData } from "../forms/AddCardForm";
import { useAppContext } from "../../state/appContext";
import { useClickOutside } from "../../hooks/useClickOutside";
import "./Column.scss";

const modalStyles = {
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

const getNextCardOrdinal = (columnCards: ColumnCard[]): number => {
  let nextIndex = 0;

  for (const card of columnCards) {
    nextIndex = Math.max(card.ordinal, nextIndex);
  }

  return nextIndex + 1;
};

export type ColumnType = (props: { column: BoardColumn }) => React.JSX.Element;

export const Column = memo<ColumnType>(
  ({ column: { id: columnId, name, columnCards } }) => {
    const columnRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const cardListRef = useRef<HTMLDivElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const [isCreateCaseModalOpened, setIsCreateCaseModalOpened] =
      useState(false);
    const [isEditable, setIsEditable] = useState(false);

    const { deleteColumn, addNewCaseCard } = useAppContext();
    // TODO: move to a separate component
    // useClickOutside(modalRef, useCallback(() => setIsCreateCaseModalOpened(false), []));

    const handleColumnDeleteClick = () => {
      deleteColumn(columnId);
    };

    const handleNewCaseCreateClick = () => {
      setIsCreateCaseModalOpened(true);
    };

    const handleColumnTitleEdit = () => {
      setIsEditable(true);
    };

    const handleBlur = () => {
      setIsEditable(false);
    };

    const handleNewCaseCreateSubmit = (data: AddCardFormData) => {
      addNewCaseCard({
        ...data,
        boardColumnId: columnId,
        ordinal: getNextCardOrdinal(columnCards),
      });
      setIsCreateCaseModalOpened(false);
    };

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
        <div
          className="app-board-column--header"
          ref={headerRef}
          data-testid={`column-${columnId}`}
        >
          <div className="app-board-column--title-container">
            <div
              className={`app-board-column--title ${isEditable ? "--title-editable" : ""}`}
              contentEditable={isEditable}
              suppressContentEditableWarning={true}
              onBlur={handleBlur}
            >
              {name}
            </div>
            <IconButton
              icon={() => <EditIcon size="small" label="Edit" />}
              appearance="subtle"
              label="Edit Title"
              onClick={handleColumnTitleEdit}
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
          style={modalStyles}
        >
          <section ref={modalRef} className="app-board-column__modal">
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
