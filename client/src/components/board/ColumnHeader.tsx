import { RefObject, useRef, useState, memo } from "react";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import EditIcon from "@atlaskit/icon/glyph/edit";
import { IconButton } from "@atlaskit/button/new";
import { useAppContext } from "../../state";
import { useClickOutside, useEscapeKey } from "../../hooks";
import { BoardColumn } from "../../types";
import "./ColumnHeader.scss";

export type ColumnHeaderType = (props: {
  column: BoardColumn;
  ref: RefObject<HTMLDivElement | null>;
}) => React.JSX.Element;

export const ColumnHeader = memo<ColumnHeaderType>(
  ({ column: { id: columnId, name }, ref }) => {
    const editBoxRef = useRef<HTMLDivElement | null>(null);

    const [isEditable, setIsEditable] = useState(false);
    const [columnName, setColumnName] = useState(name);

    const { deleteColumn, updateColumn } = useAppContext();

    useClickOutside(editBoxRef, () => setIsEditable(false));
    useEscapeKey(() => {
      setIsEditable(false);
      // setColumnName("sdfsdf");
    });

    const handleColumnTitleEdit = () => {
      setIsEditable(true);
      editBoxRef.current?.focus();
    };

    const handleColumnDeleteClick = () => {
      deleteColumn(columnId);
    };

    return (
      <div
        className="app-board-column--header"
        ref={ref}
        data-testid={`column-${columnId}`}
      >
        <div ref={editBoxRef} className="app-board-column--title-container">
          <div
            className={`app-board-column--title ${isEditable ? "--title-editable" : ""}`}
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
          >
            {columnName}
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
    );
  }
);
