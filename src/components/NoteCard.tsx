import { Droppable } from "react-beautiful-dnd";
import { INotesList } from "../interfaces/NotesInterface";

import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { BsImages } from "react-icons/bs";


import Note from "./Notes.tsx";

type NoteCardProps = {
    container: INotesList,
    index: number,
    state: INotesList[],
    setState: (newState: INotesList[]) => void;
}

const NoteCard = (props: NoteCardProps) => {
  return (
    <Droppable key={props.index} droppableId={`${props.index}`}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`${
            snapshot.isDraggingOver ? "bg-blue-300" : "bg-[#F1F2F4]"
          } p-2 w-60 px-3 py-3 min-w-[250px] rounded-2xl duration-150 delay-75 mzx-w-[90vw] overflow-hidden`}
        >
          <div className="heading flex justify-between h-4 items-center pr-1 py-4">
            <div className="text-sm font-medium text-gray-800">
              {props.container.isEditable ? (
                <input
                  type="text"
                  value={props.container.name}
                  onChange={(e) => handleNameChange(e, props.container.id)}
                  onBlur={() => toggleEditMode(props.container.id)}
                  className="input bg-[#F1F2F4] pl-[0.58rem] py-1 border-none"
                  autoFocus
                  placeholder="Title"
                />
              ) : (
                <p onClick={() => toggleEditMode(props.container.id)} className="pl-3">
                  {props.container.name}
                </p>
              )}
            </div>
            <span onClick={() => deleteCard(props.index)} className="cursor-pointer">
              <AiFillDelete />
            </span>
          </div>
          <div className="text-xs font-light py-1 px-3">
            {state[ind].notes.length} card
            {state[ind].notes.length > 1 && "s"}
          </div>
          {props.container.notes.map((item, index) => (
            <Note
              key={props.index + index}
              userId={user?.uid || ""}
              container={props.container}
              containerIndex={props.index}
              note={item}
              index={index}
              state={props.state}
              setState={props.setState}
            />
          ))}
          <div className="flex gap-2 mt-4 mb-2 ml-1">
            <span
              className="cursor-pointer"
              onClick={() => addElement(props.container, props.index)}
            >
              <AiOutlinePlus />
            </span>
            <label className="cursor-pointer">
              <input
                className="hidden"
                type="file"
                onChange={(e) => uploadImage(e, props.container, props.index)}
              />
              <BsImages />
            </label>
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default NoteCard;
