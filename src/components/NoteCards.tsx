import { ChangeEvent } from 'react'
import { Droppable } from "react-beautiful-dnd";
import toast from "react-hot-toast";

import { db, storage } from "../config/firebaseConfig.ts";
import { collection, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { BsImages } from "react-icons/bs";

import { INotesList } from "../interfaces/NotesInterface";
import Note from "./Notes.tsx";


type NoteCardProps = {
  userId: string,
  container: INotesList;
  index: number;
  state: INotesList[];
  setState: (newState: INotesList[]) => void;
};


const NoteCard = (props: NoteCardProps) => {

  const deleteCard = async (index: number) => {
    if (props.userId) {
      try {
        const userDocRef = doc(db, "users", props.userId);
        const noteContainerRef = doc(
          userDocRef,
          "noteContainer",
          props.state[index].id
        );

        await deleteDoc(noteContainerRef);
      } catch (err) {
        console.log(err);
      }
    }

    // const newState = [...state];
    // newState.splice(index, 1);
    // setState(newState);

    toast.success("Note list deleted");
  };

  const addElement = async (container: any) => {
    let newNoteRef;
    if (props.userId) {
      try {
        const userDocRef = doc(db, "users", props.userId);
        const noteContainerRef = doc(userDocRef, "noteContainer", container.id);

        const noteData = {
          isEditable: false,
          content: "Tap to Edit",
          index: container.notes.length
            ? container.notes[container.notes.length - 1].index + 1
            : 0,
        };

        newNoteRef = await addDoc(
          collection(noteContainerRef, "notes"),
          noteData
        );

        await toast.promise(
          new Promise<void>((resolve) => {
            resolve();
          }),
          {
            loading: "Loading",
            success: "Note Created",
            error: "Error while creating note",
          }
        );
        // getUserNoteContainers(user.uid)
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error while creating note");
      }
    }

    //   if (container.notes.length) {
    //     console.log('running')
    //     const newNotes = [
    //       ...[
    //         {
    //           content: "Tap to Edit",
    //         isEditable: false,
    //         id: user ? newNoteRef?.id : Date.now().toString(),
    //         index: container.notes.length
    //         ? container.notes[container.notes.length - 1].index + 1
    //         : 0,
    //       },
    //     ],
    //   ];
    //   container.notes = newNotes;
    //   const tempState = [...state];
    //   tempState.splice(index, 1, container);
    //   setState(tempState);
    // }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, objectId: string) => {
    const updatedData = props.state.map((object) => {
      if (object.id === objectId) {
        return { ...object, name: e.target.value };
      }
      return object;
    });
    props.setState(updatedData);
  };

  const editName = async (containerId: string) => {
    if (props.userId) {
      const noteContainerRef = doc(
        db,
        "users",
        props.userId,
        "noteContainer",
        containerId
      );

      const container = props.state.find((obj) => obj.id === containerId);
      if (container) {
        const newName = { name: container.name };
        await updateDoc(noteContainerRef, newName);
      }
    }
  };

  const toggleEditMode = async (containerId: string) => {
    const updatedData = props.state.map((object) => {
      if (object.id === containerId) {
        return { ...object, isEditable: !object.isEditable };
      }
      return object;
    });
    props.setState(updatedData);

    editName(containerId);
  };

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>, container: any, index: number) => {
    if (e.target.files) {
      const imageUpload = e.target.files[0];

      const uniqueName = Math.random().toString(36).substring(2, 12) + Date.now().toString();

      const imageRef = ref(storage, uniqueName);
      await uploadBytes(imageRef, imageUpload);

      const pathRef = ref(storage, uniqueName);
      const url = await getDownloadURL(pathRef);

      let newNoteRef;
      if (props.userId) {
        try {
          const userDocRef = doc(db, "users", props.userId);
          const noteContainerRef = doc(userDocRef, "noteContainer", container.id);

          const noteData = {
            isEditable: false,
            content: url,
            index: container.notes.length
              ? container.notes[container.notes.length - 1].index + 1
              : 0,
          };

          newNoteRef = await addDoc(
            collection(noteContainerRef, "notes"),
            noteData
          );

          await toast.promise(
            new Promise<void>((resolve) => {
              resolve();
            }),
            {
              loading: "Loading",
              success: "Note Created",
              error: "Error while creating note",
            }
          );
        } catch (error) {
          console.error("Error:", error);
          toast.error("Error while creating note");
        }
      }

      const newNotes = [
        ...container.notes,
        ...[
          {
            content: url,
            isEditable: false,
            id: props.userId || Date.now().toString(),
            index: container.notes.length
              ? container.notes[container.notes.length - 1].index + 1
              : 0,
          },
        ],
      ];
      container.notes = newNotes;
      const tempState = [...props.state];
      tempState.splice(index, 1, container);
      props.setState(tempState);
    }
  };

  return (
    <Droppable key={props.index} droppableId={`${props.index}`}>
      {(provided, snapshot) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className={`${snapshot.isDraggingOver ? "bg-blue-300" : "bg-[#F1F2F4]"} p-2 w-60 px-3 py-3 min-w-[250px] rounded-2xl duration-150 delay-75 mzx-w-[90vw] overflow-hidden`}>
          <div className="heading flex justify-between h-4 items-center pr-1 py-4">

            <div className="text-sm font-medium text-gray-800">
              {props.container.isEditable ? (
                <input type="text" className="input bg-[#F1F2F4] pl-[0.58rem] py-1 border-none" autoFocus placeholder="Title"
                  value={props.container.name}
                  onChange={(e) => handleNameChange(e, props.container.id)}
                  onBlur={() => toggleEditMode(props.container.id)}/>
              ) : (
                <p onClick={() => toggleEditMode(props.container.id)} className="pl-3">
                  {props.container.name}
                </p>
              )}
            </div>
            <span onClick={() => deleteCard(props.index)} className="cursor-pointer" >
              <AiFillDelete />
            </span>
          </div>

          <div className="text-xs font-light py-1 px-3">
            {props.state[props.index].notes.length} card
            {props.state[props.index].notes.length > 1 && "s"}
          </div>

          {props.container.notes.map((item, index) => (
            <Note key={props.index + index} userId={props.userId} container={props.container} containerIndex={props.index} note={item} index={index} state={props.state} setState={props.setState} />
          ))}

          <div className="flex gap-2 mt-4 mb-2 ml-1">
            <span className="cursor-pointer" onClick={() => addElement(props.container)} >
              <AiOutlinePlus />
            </span>
            <label className="cursor-pointer">
              <input className="hidden" type="file" onChange={(e) => uploadImage(e, props.container, props.index)} />
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