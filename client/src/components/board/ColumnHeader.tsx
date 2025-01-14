import {
  ChangeEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
  memo,
  useCallback,
} from "react";
import Modal from "react-modal";
import Button from "@atlaskit/button/new";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import EditIcon from "@atlaskit/icon/glyph/edit";
import { IconButton } from "@atlaskit/button/new";
import { useAppContext } from "../../state";
import { useClickOutside, useEscapeKey } from "../../hooks";
import { BoardColumn } from "../../types";
import "./ColumnHeader.scss";

const deleteColumnModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: 0,
    borderRadius: "2px",
    transform: "translate(-50%, -50%)",
    maxWidth: "25em",
  },
  overlay: {
    zIndex: 999,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
};

const MAX_TITLE_LENGTH = 30;

export type ColumnHeaderType = (props: {
  column: BoardColumn;
  ref: RefObject<HTMLDivElement | null>;
  onColumnDelete: (id: string) => void;
}) => React.JSX.Element;

export const ColumnHeader = memo<ColumnHeaderType>(
  ({ column, ref, onColumnDelete }) => {
    const { id: columnId, name } = column || {};

    const editBoxRef = useRef<HTMLDivElement | null>(null);
    const editableRef = useRef<HTMLInputElement | null>(null);
    const previousNameValue = useRef<string>(name);

    const [isEditable, setIsEditable] = useState(false);
    const [isDeleteColumnModalOpened, setIsDeleteColumnModalOpened] =
      useState(false);
    const [columnName, setColumnName] = useState(name);

    const { deleteColumn, updateColumn } = useAppContext();

    const handleTitleUpdate = useCallback(() => {
      setIsEditable(false);

      if (previousNameValue.current !== columnName) {
        updateColumn({ ...column, name: columnName });
        previousNameValue.current = columnName;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [column, columnName]);

    useClickOutside(editBoxRef, handleTitleUpdate);
    useEscapeKey(handleTitleUpdate);

    const handleTitleInput = (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value || "";

      if (text.length <= MAX_TITLE_LENGTH) {
        setColumnName(text);
      }
    };

    const handleColumnTitleEdit = () => {
      setIsEditable((isEnabled) => !isEnabled);
    };

    const handleColumnDeleteClick = () => {
      setIsDeleteColumnModalOpened(true);
    };

    const handleColumnDelete = useCallback(async () => {
      setIsDeleteColumnModalOpened(false);

      const deletedId = await deleteColumn(columnId);

      if (deletedId) {
        onColumnDelete(deletedId);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (editableRef.current && isEditable) {
        // Focus the input
        editableRef.current.focus();
        // Move the cursor to the end of the text
        const length = editableRef.current.value.length;
        editableRef.current.setSelectionRange(length, length);
      }
    }, [isEditable]);

    return (
      <div
        className="app-board-column--header"
        ref={ref}
        data-testid={`column-${columnId}`}
      >
        <div className="app-board-column--title-container">
          {isEditable ? (
            <input
              className="app-board-column--title-editable"
              ref={editableRef}
              value={columnName}
              placeholder="Column title"
              onChange={handleTitleInput}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="app-board-column--title">{columnName}</div>
          )}
        </div>

        <div ref={editBoxRef}>
          <IconButton
            icon={() => <EditIcon size="small" label="Edit" />}
            appearance="subtle"
            label="Edit Title"
            onClick={handleColumnTitleEdit}
          />
          <IconButton
            icon={() => <TrashIcon size="small" label="Delete" />}
            label="Delete Column"
            appearance="subtle"
            onClick={handleColumnDeleteClick}
          />
        </div>

        <Modal
          isOpen={isDeleteColumnModalOpened}
          ariaHideApp={false}
          style={deleteColumnModalStyles}
        >
          <section className="app-board-column__modal-delete-col">
            <p>
              Are you sure you want to delete this column? This will permanently
              remove the column and assigned cards.
            </p>
            <div className="app-board-column__modal-delete-col-buttons">
              <Button onClick={() => setIsDeleteColumnModalOpened(false)}>
                Cancel
              </Button>
              <Button onClick={handleColumnDelete} appearance="danger">
                Delete
              </Button>
            </div>
          </section>
        </Modal>
      </div>
    );
  }
);
