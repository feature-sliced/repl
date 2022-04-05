import React from "react";
import type { CSSProperties } from "react";
import {
  Move,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit,
  Save,
  Delete,
} from "@geist-ui/react-icons";
import { styled } from "@linaria/react";
import { Button, Input, Popover } from "@geist-ui/react";
import { useTreeTheme, useTreeUnits } from "./context";
import { useStore, useStoreMap } from "effector-react";
import { Id } from "../model/types";
import { useEvent } from "effector-react/scope";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  fsTheme,
  palette,
} from "shared/config/theme";

const DESCRIPTION_LENGTH_LIMIT = 18;
const TITLE_LENGTH_LIMIT = 12;

const trimText = (text: string, limit: number) =>
  text.length > limit ? `${text.slice(0, limit)}...` : text;

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (!(isSorting || wasDragging));

type ItemProps = {
  id: Id;
  depth: number;
  collapsed: boolean;
  editMode: boolean;
};

export const Item: React.FC<ItemProps> = (props) => {
  // sortable stuff
  const {
    attributes,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id: props.id,
    animateLayoutChanges,
  });
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const theme = useTreeTheme();

  return (
    <div
      ref={setDroppableNodeRef}
      style={{
        ...style,
        maxWidth: `${100 - props.depth * 2}%`,
        paddingLeft: theme.depthPadding * (props.depth - 1),
      }}
    >
      <div ref={setDraggableNodeRef}>
        <ItemBase
          {...props}
          attributes={attributes}
          listeners={listeners}
        />
      </div>
    </div>
  );
};

type PopupProps = {
  text: string;
}

const PopupContent: React.FC<PopupProps> = ({text}) => (
    <div style={{ padding: "0 10px" }}>
      <p>{text}</p>
    </div>
);

export const ItemBase: React.FC<ItemProps & {
  attributes?: ReturnType<typeof useSortable>["attributes"];
  listeners?: ReturnType<typeof useSortable>["listeners"];
}> = (props) => {
  const theme = useTreeTheme();
  const units = useTreeUnits();
  const hoveredTreeNodeId = useStore(units.$hoveredNodeId);

  const item = useStoreMap({
    store: units.$itemsKv,
    keys: [props.id],
    fn: (kv, [id]) =>
      kv[id] ?? { title: "Something went wrong", text: "Item not found" },
  });

  const itemEditValues = useStoreMap({
      store: units.$itemsDynamicState,
      keys: [props.id],
      fn: (kv, [id]) =>
              kv[id] ?? { editTitle: "Something went wrong", editText: "Item not found" },
  });

  const toggleCollapse = useEvent(units.toggleCollapsed);
  const remove = useEvent(units.removeItem);

  const inputText = useEvent(units.editItemText);
  const inputTitle = useEvent(units.editItemTitle);

  const saveEvent = useEvent(units.saveEditData);
  const toggleEditMode = useEvent(units.toggleEditMode);

  const handeSave = () => {
    saveEvent(props.id);
  };

  const handeEditMode = () => {
    toggleEditMode(props.id);
  };

  return (
    <Box
      className={theme.hoveredNodeClassName}
      style={hoveredTreeNodeId === props.id ? theme.hoveredNodeStyle : {}}
    >
            <span>
                <DragHandle {...props.attributes} {...props.listeners} />{" "}
              <Button
                iconRight={
                  props.collapsed ? <ChevronRight/> : <ChevronDown/>
                }
                auto
                scale={1 / 3}
                onClick={() => toggleCollapse(props.id)}
              />
              {props.editMode ? (
                <Button
                  iconRight={<Save/>}
                  auto
                  scale={1 / 3}
                  type="success"
                  ghost
                  onClick={handeSave}
                />
              ) : (
                <Button
                  iconRight={<Edit/>}
                  auto
                  scale={1 / 3}
                  type="secondary-light"
                  ghost
                  onClick={handeEditMode}
                />
              )}
            </span>
      <Details>
        {props.editMode ? (
          <>
            <Input
              scale={2 / 3}
              placeholder="Title"
              autoFocus
              defaultValue={item.title}
              value={itemEditValues.editTitle}
              enterKeyHint="enter"
              type="success"
              onChange={(event) =>
                inputTitle({id: props.id, text: event.target.value})
              }
            />
            <Input
              scale={2 / 3}
              placeholder="Description"
              defaultValue={item.text}
              value={itemEditValues.editText}
              enterKeyHint="enter"
              type="success"
              onChange={(event) =>
                inputText({id: props.id, text: event.target.value})
              }
            />
          </>
        ) : (
          <>
            <Popover content={<PopupContent text={item.title || ""}/>}>
              <h4>{trimText(item.title, TITLE_LENGTH_LIMIT)}</h4>
            </Popover>
            <Popover content={<PopupContent text={item.text || ""}/>}>
              <p>
                {trimText(
                  item.text || "",
                  DESCRIPTION_LENGTH_LIMIT,
                )}
              </p>
            </Popover>
          </>
        )}
      </Details>

      <div>
        {props.editMode ? (
          <Button
            iconRight={<Delete/>}
            auto
            scale={1 / 3}
            type="error"
            ghost
            onClick={handeEditMode}
          />
        ) : (
          <Button
            iconRight={<Trash2/>}
            auto
            scale={1 / 3}
            type="error"
            ghost
            onClick={() => remove(props.id)}
          />
        )}
      </div>
    </Box>
  );
};

const Box = styled.div`
  display: flex;
  align-items: center;
  background-color: ${palette.alternative};
  border-radius: ${fsTheme.layout.radius};
  margin-bottom: ${fsTheme.layout.gapHalf};
  padding: ${fsTheme.layout.gapHalf};

  & > *:not(:last-child) {
    display: flex;
    margin-right: ${fsTheme.layout.gapHalf};
    align-items: center;
  }

  & > :last-child {
    display: flex;
    flex-grow: 10;
    justify-content: flex-end;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;

  & > *:not(:last-child) {
    margin-right: ${fsTheme.layout.gapHalf};
  }

  & > * {
    p {
      display: inline;
      padding-right: 10px;
    }

    h4 {
      font-size: ${fsTheme.layout.gap};
      padding: 0 10px;
      margin-bottom: 0;
    }
  }
`;

const DragHandle = styled((props) => (
  <Button iconRight={<Move/>} auto scale={1 / 3} {...props} />
))`
  cursor: move;
`;
