import { useState, useContext } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { MdDeleteOutline } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";

import "../App.css";

import { INotesList } from "../interfaces/NotesInterface";
import { ItemType } from "../types/NoteType";
import Gradient from "./Gradient";
import { AuthContext } from '../context/authContext.tsx'


// Fake data generator
const getItems = (count: number, offset = 0) =>
  Array.from({ length: count }, (k: number) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `Click to Edit`,
    isEditable: false,
  }));



const reorder = (
  list: ItemType,
  startIndex: number,
  endIndex: number
): ItemType => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (
  source: ItemType,
  destination: ItemType,
  droppableSource: { droppableId: string; index: number },
  droppableDestination: { droppableId: string; index: number }
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: { [key: string]: ItemType } = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

function NotesDisplay() {
  const [hover, setHover] = useState<string>("");
  const [state, setState] = useState<INotesList[]>([]);

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    console.log(result);

    // Dropped outside the list
    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd].notes, source.index, destination.index);
      let newObject = state[sInd];
      newObject.notes = items;
      console.log(newObject);
      const tempState = [...state];
      tempState.splice(sInd, 1, newObject);
      setState(tempState);
    } else {
      const result = move(
        state[sInd].notes,
        state[dInd].notes,
        source,
        destination
      );
      // const newState = [...state];
      const tempState = [...state];
      tempState[sInd].notes = result[sInd];
      tempState[dInd].notes = result[dInd];
      // newState[sInd] = result[sInd];
      // newState[dInd] = result[dInd];

      setState(tempState);
    }
  }

  const deleteCard = (index: number) => {
    const newState = [...state];
    newState.splice(index, 1);
    setState(newState);
  };

  const addElement = (element: INotesList, index: number) => {
    const newNotes = [...element.notes, ...getItems(1)];
    element.notes = newNotes;
    const tempState = [...state];
    tempState.splice(index, 1, element);
    setState(tempState);
  };

  const deleteElement = (mainIndex: number, subIndex: number) => {
    const newState = [...state]; // Create a copy of the state array

    const notes = [...state[mainIndex].notes]; // Create a copy of the notes array within the specified mainIndex
    notes.splice(subIndex, 1); // Remove the element at the specified subIndex

    newState[mainIndex] = { ...state[mainIndex], notes }; // Update the notes array in the newState

    // Use newState as needed (e.g., set it as the new state or perform other operations)
    console.log(newState);
    setState(newState);
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    objectId: number
  ) => {
    const updatedData = state.map((object) => {
      if (object.id === objectId) {
        return { ...object, name: e.target.value };
      }
      return object;
    });
    setState(updatedData);
  };

  const toggleEditMode = (objectId: number) => {
    const updatedData = state.map((object) => {
      if (object.id === objectId) {
        return { ...object, isEditable: !object.isEditable };
      }
      return object;
    });
    setState(updatedData);
  };

  const handleContentChangeItem = (
    e: React.ChangeEvent<HTMLInputElement>,
    objectId: number,
    noteId: string
  ) => {
    const updatedData = state.map((object) => {
      if (object.id === objectId) {
        const updatedNotes = object.notes.map((note) => {
          if (note.id === noteId) {
            return { ...note, content: e.target.value };
          }
          return note;
        });
        return { ...object, notes: updatedNotes };
      }
      return object;
    });
    setState(updatedData);
  };

  const toggleEditModeItem = (objectId: number, noteId: string) => {
    const updatedData = state.map((object) => {
      if (object.id === objectId) {
        const updatedNotes = object.notes.map((note) => {
          if (note.id === noteId) {
            return { ...note, isEditable: !note.isEditable };
          }
          return note;
        });
        return { ...object, notes: updatedNotes };
      }
      return object;
    });
    setState(updatedData);
  };
  const { user } = useContext(AuthContext)
  console.log(user)


  return (
    <div className="w-full grow bg-blue-800 px-2 md:px-10">
      <Gradient />
      <div className="flex flex-wrap gap-5 max-w-7xl mx-auto mt-10">
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`${
                    snapshot.isDraggingOver ? "bg-blue-300" : "bg-[#F1F2F4]"
                  } p-2 w-60 px-3 py-3 min-w-[250px] rounded-2xl duration-150 delay-75`}
                >
                  <div className="heading flex justify-between h-4 items-center pr-1 py-4">
                    <div className="text-sm font-medium text-gray-800">
                      {el.isEditable ? (
                        <input
                          type="text"
                          value={el.name}
                          onChange={(e) => handleNameChange(e, el.id)}
                          onBlur={() => toggleEditMode(el.id)}
                          className="input bg-[#F1F2F4] pl-[0.58rem] py-1 border-none"
                          autoFocus
                          placeholder="Title"
                        />
                      ) : (
                        <p
                          onClick={() => toggleEditMode(el.id)}
                          className="pl-3"
                        >
                          {el.name}
                        </p>
                      )}
                    </div>
                    <span
                      onClick={() => deleteCard(ind)}
                      className="cursor-pointer"
                    >
                      <AiFillDelete />
                    </span>
                  </div>
                  <div className="text-xs font-light py-1 px-3">
                    {state[ind].notes.length} card
                    {state[ind].notes.length > 1 && "s"}
                  </div>
                  {el.notes.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`note ${
                            snapshot.isDragging
                              ? "bg-yellow-300 skew-y-6"
                              : "bg-white skew-y-0"
                          } select-none rounded-xl my-2 flex items-center px-3 py-2`}
                          onMouseEnter={() => setHover(`${item.id}`)}
                          onMouseLeave={() => setHover("")}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style }}
                        >
                          <div className="w-full flex justify-between">
                            <div>
                              {item.isEditable ? (
                                <input
                                  type="text"
                                  value={item.content}
                                  onChange={(e) =>
                                    handleContentChangeItem(e, el.id, item.id)
                                  }
                                  onBlur={() =>
                                    toggleEditModeItem(el.id, item.id)
                                  }
                                  className="bg-[white] pl-[0.58rem] py-1 border-none"
                                  autoFocus
                                />
                              ) : (
                                <p className="pl-3">{item.content}</p>
                              )}
                            </div>
                            <div
                              className={`buttons flex gap-2 ${
                                hover.includes(item.id) ? "block" : "hidden"
                              } ${item.isEditable ? "hidden" : "block"}`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  toggleEditModeItem(el.id, item.id)
                                }
                              >
                                <BiPencil />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  deleteElement(ind, index);
                                }}
                              >
                                <MdDeleteOutline />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <span
                    className="block cursor-pointer"
                    onClick={() => addElement(el, ind)}
                  >
                    +
                  </span>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
        <button
          className="p-2 w-60 px-3 py-3 min-w-[250px] rounded-2xl duration-200 delay-75 bg-[#F1F2F4] hover:bg-gray-300 h-auto ease-out"
          type="button"
          onClick={() => {
            setState([
              ...state,
              {
                id: Date.now(),
                name: `Untitled ${state.length + 1}`,
                notes: [],
                isEditable: false,
              },
            ]);
          }}
        >
          + Add new list
        </button>
      </div>
    </div>
  );
}

export default NotesDisplay;
