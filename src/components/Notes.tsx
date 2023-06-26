import { useState } from 'react'
import { Draggable } from "react-beautiful-dnd";
import { INote, INotesList } from "../interfaces/NotesInterface";

import toast from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import { BiPencil } from "react-icons/bi";

import { db } from "../config/firebaseConfig.ts";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

type NoteProps = {
    userId: string,
    container: INotesList,
    containerIndex: number,
    note: INote,
    index: number,
    state: INotesList[],
    setState: (newState: INotesList[]) => void;
}

const Note = (props: NoteProps) => {
  const [hover, setHover] = useState<string>("");
  console.log(props.state)

  const handleContentChangeNote = (
    e: React.ChangeEvent<HTMLInputElement>,
    objectId: string,
    noteId: string
  ) => {
    const updatedData = props.state.map((object) => {
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
    props.setState(updatedData);
  };

  const editContent = async (changeContainer: INotesList, noteId: string) => {
    if (props.userId) {
      const noteRef = doc(
        db,
        "users",
        props.userId,
        "noteContainer",
        changeContainer.id,
        "notes",
        noteId
      );;
      if (changeContainer) {
        const note = changeContainer.notes.find((nt) => nt.id === noteId);
        if (note) {
          const newContent = {
            content: note.content,
          };
          await updateDoc(noteRef, newContent);
        }
      }
    }
  };

  const toggleEditModeNote = (changeContainer: INotesList, noteId: string) => {
    console.log(props.state)
    const updatedData = props.state.map((object) => {
      if (object.id === changeContainer.id) {
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
    props.setState(updatedData);

    editContent(changeContainer, noteId);
  };


  const deleteElement = async (contanerId: string, noteId: string) => {
    if (props.userId) {
      try {
        console.log('deleting')  
        const userDocRef = doc(db, "users", props.userId);
        const noteContainerRef = doc(
          userDocRef,
          "noteContainer",
          contanerId
        );
        const noteRef = doc(
          collection(noteContainerRef, "notes"),
          noteId
        );

        await deleteDoc(noteRef);
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }

    // const newState = [...state]; // Create a copy of the state array
    // const notes = [...state[mainIndex].notes]; // Create a copy of the notes array within the specified mainIndex
    // notes.splice(subIndex, 1); // Remove the element at the specified subIndex
    // newState[mainIndex] = { ...state[mainIndex], notes }; // Update the notes array in the newState
    // // Use newState as needed (e.g., set it as the new state or perform other operations)
    // setState(newState);

    toast.success("Note Deleted");
  };

  return (
    <Draggable key={props.note.id} draggableId={props.note.id} index={props.index}>
      {(provided, snapshot) => (
        <div
          className={`note ${
            snapshot.isDragging ? "bg-yellow-300 skew-y-6" : "bg-white skew-y-0"
          } select-none rounded-xl my-2 flex item-center px-3 py-2 overflow-auto`}
          onMouseEnter={() => setHover(`${props.note.id}`)}
          onMouseLeave={() => setHover("")}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style }}
        >
          <div className="w-full flex justify-between">
            {props.note.content.substring(0, 38) ===
            "https://firebasestorage.googleapis.com" ? (
              <img src={props.note.content} className="h-20" />
            ) : (
              <div>
                {props.note.isEditable ? (
                  <input
                    type="text"
                    value={props.note.content}
                    onChange={(e) => handleContentChangeNote(e, props.container.id, props.note.id)}
                    onBlur={() => toggleEditModeNote(props.container, props.note.id)}
                    className="bg-[white] pl-[0.58rem] py-1 border-none"
                    autoFocus
                  />
                ) : (
                  <span className="pl-3">{props.note.content}</span>
                )}
              </div>
            )}
            <div
              className={`buttons flex gap-2 ${
                hover.includes(props.note.id) ? "block" : "hidden"
              } ${props.note.isEditable ? "hidden" : "block"}`}
            >
              <button
                type="button"
                onClick={() => toggleEditModeNote(props.container, props.note.id)}
              >
                <BiPencil />
              </button>
              <button
                type="button"
                onClick={() => {
                //   deleteElement(props.containerIndex, props.index);
                  deleteElement(props.container.id, props.note.id);
                }}
              >
                <MdDeleteOutline />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Note;
