import {
  ChangeEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
  memo,
  useCallback,
} from "react";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import EditIcon from "@atlaskit/icon/glyph/edit";
import { IconButton } from "@atlaskit/button/new";
import { useAppContext } from "../../state";
import { useClickOutside, useEscapeKey } from "../../hooks";
import { BoardColumn } from "../../types";
import "./ColumnHeader.scss";

const MAX_TITLE_LENGTH = 30;

export type ColumnHeaderType = (props: {
  column: BoardColumn;
  ref: RefObject<HTMLDivElement | null>;
}) => React.JSX.Element;

export const ColumnHeader = memo<ColumnHeaderType>(({ column, ref }) => {
  const { id: columnId, name } = column;

  const editBoxRef = useRef<HTMLDivElement | null>(null);
  const editableRef = useRef<HTMLInputElement | null>(null);
  const previousNameValue = useRef<string>(name);

  const [isEditable, setIsEditable] = useState(false);
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
    deleteColumn(columnId);
  };

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
          icon={TrashIcon}
          label="Delete Column"
          appearance="subtle"
          onClick={handleColumnDeleteClick}
        />
      </div>
    </div>
  );
});
