import { useState, useEffect, useContext } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import toast, { Toaster } from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import { BsImages } from "react-icons/bs";

import "../App.css";

import { INote, INotesList } from "../interfaces/NotesInterface";
import { ItemType } from "../types/NoteType";
import Gradient from "./Gradient";
import { AuthContext } from "../context/authContext.tsx";

import { db, storage } from "../config/firebaseConfig.ts";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Loader from "./Loader.tsx";

function NotesDisplay() {
  const [fetching, setFetching] = useState(false);
  const [hover, setHover] = useState<string>("");
  const [state, setState] = useState<INotesList[]>([]);

  const { user } = useContext(AuthContext);

  const getUserNoteContainers = (userId: string) => {
    // setFetching(true);
    const unsub = onSnapshot(collection(doc(db, "users", userId), "noteContainer"), (noteContainerQuerySnapshot) => {
      try {
        const noteContainers: INotesList[] = [];

        noteContainerQuerySnapshot.docs.map((noteContainerDoc) => {
          let firstTime = true
          const noteContainerData = noteContainerDoc.data();
          console.log('fething container')
          const noteContainer: INotesList = {
            id: noteContainerDoc.id.toString(),
            name: noteContainerData.name,
            notes: [],
            isEditable: noteContainerData.isEditable,
            index: noteContainerData.index,
          };

          try {
            const unsub2 = onSnapshot(collection(noteContainerDoc.ref, "notes"), (notesQuerySnapshot) => {
              // console.log(notesQuerySnapshot.docs[notesQuerySnapshot.docs.length-1].id)
              console.log(noteContainer)
              noteContainer.notes = [];
              // console.log(noteContainerDoc)
              notesQuerySnapshot.docs.map((noteDoc) => {
                const noteData = noteDoc.data();
                console.log(noteData)
                console.log('fetching note', state)
                const note: INote = {
                  id: noteDoc.id,
                  content: noteData.content,
                  isEditable: noteData.isEditable,
                  index: noteData.index,
                };
                noteContainer.notes.push(note);
              });
              if (state.length) {
                let tempState = [...state]
                tempState[tempState.findIndex(obj => obj.id === noteContainer.id)] = noteContainer;
                setState(tempState)
              }
            });
          }  catch (err) {console.log(err);}
          noteContainers.push(noteContainer);
        });

        // Sort noteContainers based on the index
        noteContainers.sort((a, b) => a.index - b.index);

        // Sort notes array inside each container based on the index
        noteContainers.forEach((container) => {
          container.notes.sort((a, b) => a.index - b.index);
        });

        setTimeout(() => {
          // setFetching(false);
          setTimeout(() => {
            setState(noteContainers);
          }, 200);
        }, 1000);
        console.log(noteContainers);
        console.log(state)
      } catch (err) {
        console.log(err);
      }
    });
  };
  useEffect(() => {
    

    // const getUserNoteContainers = (userId: string) => {
    //   // setFetching(true);
    //   const userDocRef = doc(db, "users", userId);
    //   const noteContainerRef = collection(userDocRef, "noteContainer");
    //   onSnapshot(noteContainerRef, (noteContainerQuerySnapshot) => {
    //     try {
    //       const noteContainers: INotesList[] = [];

    //       noteContainerQuerySnapshot.docs.map((noteContainerDoc) => {
    //         const noteContainerData = noteContainerDoc.data();
    //         const noteContainer: INotesList = {
    //           id: noteContainerDoc.id.toString(),
    //           name: noteContainerData.name,
    //           notes: [],
    //           isEditable: noteContainerData.isEditable,
    //           index: noteContainerData.index,
    //         };

    //         const notesRef = collection(noteContainerDoc.ref, "notes");
    //         onSnapshot(notesRef, (notesQuerySnapshot) => {
    //           notesQuerySnapshot.docs.forEach((noteDoc) => {
    //             const noteData = noteDoc.data();
    //             const note: INote = {
    //               id: noteDoc.id,
    //               content: noteData.content,
    //               isEditable: noteData.isEditable,
    //               index: noteData.index,
    //             };

    //             noteContainer.notes.push(note);
    //           });
    //         });
    //         // const notesUnsubscribe = onSnapshot(notesRef, (notesSnapshot) => {
    //         //   noteContainer.notes = [];
      
    //         //   notesSnapshot.forEach((noteDoc) => {
    //         //     const noteData = noteDoc.data();
    //         //     const note: INote = {
    //         //       id: noteDoc.id,
    //         //       content: noteData.content,
    //         //       isEditable: noteData.isEditable,
    //         //       index: noteData.index,
    //         //     };
      
    //         //     noteContainer.notes.push(note);
    //         //   });
    //         noteContainers.push(noteContainer);
    //       });

    //       // Sort noteContainers based on the index
    //       noteContainers.sort((a, b) => a.index - b.index);

    //       // Sort notes array inside each container based on the index
    //       noteContainers.forEach((container) => {
    //         container.notes.sort((a, b) => a.index - b.index);
    //       });

    //       // setFetching(false);
    //       // setTimeout(() => {
    //       setState(noteContainers);
    //       // }, 200);
    //       console.log(noteContainers, state);

    //       // Clean up the snapshot listener for notes when the noteContainer is removed
    //       // const containerUnsubscribe = onSnapshot(
    //       //   noteContainerDoc.ref,
    //       //   (containerSnapshot) => {
    //       //     if (!containerSnapshot.exists()) {
    //       //       // Remove the noteContainer from the noteContainers array
    //       //       const containerIndex = noteContainers.findIndex(
    //       //         (container) => container.id === noteContainer.id
    //       //       );
    //       //       if (containerIndex !== -1) {
    //       //         noteContainers.splice(containerIndex, 1);
    //       //         setState(noteContainers);
    //       //       }
    //       //       containerUnsubscribe(); // Stop listening to changes for this noteContainer
    //       //       notesUnsubscribe(); // Stop listening to changes for the notes inside this noteContainer
    //       //     }
    //       //   }
    //       // );
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   });
    // };
    
    let unsubscribe
    console.log(user)
    if (user) {
      // console.log('user') 
      // getUserNoteContainers(`${user.uid}`)
      unsubscribe = getUserNoteContainers(`${user.uid}`);
      } else {
        console.log('no user')
    }

    // return () => {
    //   unsubscribe()
    // }

  }, [user]);

  useEffect(() => {
    console.log(state)
  }, [state])
  
  

  const updateIds = async (
    containerIndex: number,
    id: string,
    index: number
  ) => {
    if (user) {
      const noteRef = doc(
        db,
        "users",
        user.uid,
        "noteContainer",
        state[containerIndex].id,
        "notes",
        id
      );

      const newContent = {
        index,
      };
      await updateDoc(noteRef, newContent);
    }
  };

  const reorder = (
    list: ItemType,
    startIndex: number,
    endIndex: number,
    containerIndex: number
  ) => {
    if (startIndex > endIndex) {
      //if reordering upwards
      if (endIndex === 0) {
        //if placed on top of container
        list[startIndex].index = list[endIndex].index - 1;
      } else {
        list[startIndex].index =
          (list[endIndex].index + list[endIndex - 1].index) / 2;
      }
    } else {
      if (endIndex === list.length - 1) {
        //if placed on bottom of container
        list[startIndex].index = list[endIndex].index + 1;
      } else {
        list[startIndex].index =
          (list[endIndex].index + list[endIndex + 1].index) / 2;
      }
    }

    updateIds(containerIndex, list[startIndex].id, list[startIndex].index);

    console.log(list, startIndex, endIndex);
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const updateDrag = async (
    source: { index: number; droppableId: string },
    destination: { index: number; droppableId: string },
    removed: INote
  ) => {
    let newNoteIndex: number;
    if (user) {
      try {
        // toast.promise
        toast.loading("Moving...", { duration: 2000 });
        const { content, isEditable } = removed;
        const userDocRef = doc(db, "users", user?.uid);
        const noteContainerRef: any = doc(
          userDocRef,
          "noteContainer",
          state[parseInt(destination.droppableId)].id
        );

        console.log(source, destination);
        if (!state[destination.droppableId * 1].notes.length) newNoteIndex = 0;
        else {
          if (destination.index === 0) {
            //if placed on top of another container
            newNoteIndex =
              state[destination.droppableId * 1].notes[0].index - 1;
          } else if (
            destination.index ===
            state[destination.droppableId * 1].notes[
              state[destination.droppableId * 1].notes.length - 1
            ].index +
              1
          ) {
            newNoteIndex =
              state[destination.droppableId * 1].notes[
                state[destination.droppableId * 1].notes.length - 1
              ].index + 1;
          } else {
            newNoteIndex =
              (state[destination.droppableId * 1].notes[destination.index]
                .index +
                state[destination.droppableId * 1].notes[destination.index - 1]
                  .index) /
              2;
          }
        }

        console.log(newNoteIndex);

        const newNoteRef = await addDoc(collection(noteContainerRef, "notes"), {
          content,
          isEditable,
          index: newNoteIndex,
        });

        const anotherNoteContainerRef: any = doc(
          userDocRef,
          "noteContainer",
          state[parseInt(source.droppableId)].id
        );
        const noteRef = doc(
          collection(anotherNoteContainerRef, "notes"),
          state[parseInt(source.droppableId)].notes[source.index].id
        );

        await deleteDoc(noteRef);

        toast.success("Note moved successfully");
        return [newNoteRef.id, newNoteIndex];
      } catch (error) {
        console.log("Error deleting note:", error);
      }
    }
  };

  const move = (
    source: ItemType,
    destination: ItemType,
    droppableSource: { droppableId: string; index: number },
    droppableDestination: { droppableId: string; index: number }
  ) => {
    const sourceClone = Array.from(source);
    const destClone = destination.length ? Array.from(destination) : [];
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: { [key: string]: ItemType } = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return { result, removed };
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    console.log(source, destination);

    // Dropped outside the list
    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(
        state[sInd].notes,
        source.index,
        destination.index,
        source.droppableId
      );
      let newObject = state[sInd];
      newObject.notes = items;
      const tempState = [...state];
      tempState.splice(sInd, 1, newObject);
      setState(tempState);
    } else {
      try {
        const { result, removed } = move(
          state[sInd].notes,
          state[dInd].notes,
          source,
          destination
        );
        console.log(source, destination, removed);
        const [id, index] = await updateDrag(source, destination, removed);
        // const id = res.id
        // const index = res.index
        console.log(id, index);

        const tempState: any = [...state];
        tempState[sInd].notes = result[sInd];
        tempState[dInd].notes = result[dInd];

        const updatedNotes = tempState[dInd].notes.map((note: INote) => {
          if (note.id === removed.id) {
            return {
              ...note,
              id,
              index,
            };
          }
          return note;
        });

        tempState[dInd].notes = updatedNotes;

        setState(tempState);
      } catch (error) {
        console.error("Error moving note:", error);
      }
    }
  };

  const addNoteContainer = async () => {
    let noteContainerRef;
    if (user) {
      const noteContainerData = {
        name: `Untitled ${state.length + 1}`,
        isEditable: false,
        index: state.length ? state[state.length - 1].index + 1 : 0,
      };
      const userDocRef = doc(db, "users", user?.uid);
      noteContainerRef = await addDoc(
        collection(userDocRef, "noteContainer"),
        noteContainerData
      );
    }

    // setState([
    //   ...state,
    //   {
    //     id: noteContainerRef ? noteContainerRef.id : "",
    //     name: `Untitled ${state.length + 1}`,
    //     notes: [],
    //     isEditable: false,
    //     index: state.length ? state[state.length - 1].index + 1 : 0,
    //   },
    // ]);
    toast.success("Note list created");
  };

  const deleteCard = async (index: number) => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const noteContainerRef = doc(
          userDocRef,
          "noteContainer",
          state[index].id
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

  const addElement = async (container: any, index: number) => {
    console.log('adding')
    let newNoteRef;
    if (user) {
      try {
        const userDocRef = doc(db, "users", user?.uid);
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

    if (!container.notes.length) {
      console.log('running')
      const newNotes = [
        ...[
          {
            content: "Tap to Edit",
          isEditable: false,
          id: user ? newNoteRef?.id : Date.now().toString(),
          index: container.notes.length
          ? container.notes[container.notes.length - 1].index + 1
          : 0,
        },
      ],
    ];
    container.notes = newNotes;
    const tempState = [...state];
    tempState.splice(index, 1, container);
    setState(tempState);
  }
  };
  
  const deleteElement = async (mainIndex: number, subIndex: number) => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const noteContainerRef = doc(
          userDocRef,
          "noteContainer",
          state[mainIndex].id
        );
        const noteRef = doc(
          collection(noteContainerRef, "notes"),
          state[mainIndex].notes[subIndex].id
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

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    objectId: string
  ) => {
    const updatedData = state.map((object) => {
      if (object.id === objectId) {
        return { ...object, name: e.target.value };
      }
      return object;
    });
    setState(updatedData);
  };

  const editName = async (containerId: string) => {
    if (user) {
      const noteContainerRef = doc(
        db,
        "users",
        user.uid,
        "noteContainer",
        containerId
      );

      const container = state.find((obj) => obj.id === containerId);
      if (container) {
        const newName = { name: container.name };
        await updateDoc(noteContainerRef, newName);
      }
    }
  };

  const toggleEditMode = async (containerId: string) => {
    const updatedData = state.map((object) => {
      if (object.id === containerId) {
        return { ...object, isEditable: !object.isEditable };
      }
      return object;
    });
    setState(updatedData);

    editName(containerId);
  };

  const handleContentChangeItem = (
    e: React.ChangeEvent<HTMLInputElement>,
    objectId: string,
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

  const editContent = async (containerId: string, noteId: string) => {
    if (user) {
      const noteRef = doc(
        db,
        "users",
        user.uid,
        "noteContainer",
        containerId,
        "notes",
        noteId
      );
      const container = state.find((obj) => obj.id === containerId);
      if (container) {
        const note = container.notes.find((nt) => nt.id === noteId);
        if (note) {
          const newContent = {
            content: note.content,
          };
          await updateDoc(noteRef, newContent);
        }
      }
    }
  };

  const toggleEditModeItem = (objectId: string, noteId: string) => {
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

    editContent(objectId, noteId);
  };

  const uploadImage = async (e, container: any, index: number) => {
    const imageUpload = e.target.files[0];

    const uniqueName =
      Math.random().toString(36).substring(2, 12) + Date.now().toString();

    const imageRef = ref(storage, uniqueName);
    await uploadBytes(imageRef, imageUpload);

    const pathRef = ref(storage, uniqueName);
    const url = await getDownloadURL(pathRef);

    let newNoteRef;
    if (user) {
      try {
        const userDocRef = doc(db, "users", user?.uid);
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
          id: user ? newNoteRef?.id : Date.now().toString(),
          index: container.notes.length
            ? container.notes[container.notes.length - 1].index + 1
            : 0,
        },
      ],
    ];
    container.notes = newNotes;
    const tempState = [...state];
    tempState.splice(index, 1, container);
    setState(tempState);
  };

  return (
    <div className="w-full grow bg bg-no-repeat bg-cover bg-blue-700">
      <Gradient />
      {fetching ? (
        <Loader />
      ) : (
        <div className="flex flex-wrap gap-5 max-w-7xl mx-auto mt-10 px-2 md:px-10 items-start">
          <DragDropContext onDragEnd={onDragEnd}>
            {state.map((el, ind) => (
              <Droppable key={ind} droppableId={`${ind}`}>
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
                            } select-none rounded-xl my-2 flex items-center px-3 py-2 overflow-auto`}
                            onMouseEnter={() => setHover(`${item.id}`)}
                            onMouseLeave={() => setHover("")}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...provided.draggableProps.style }}
                          >
                            <div className="w-full flex justify-between">
                              {item.content.substring(0, 38) ===
                              "https://firebasestorage.googleapis.com" ? (
                                <img src={item.content} className="h-20" />
                              ) : (
                                <div>
                                  {item.isEditable ? (
                                    <input
                                      type="text"
                                      value={item.content}
                                      onChange={(e) =>
                                        handleContentChangeItem(
                                          e,
                                          el.id,
                                          item.id
                                        )
                                      }
                                      onBlur={() =>
                                        toggleEditModeItem(el.id, item.id)
                                      }
                                      className="bg-[white] pl-[0.58rem] py-1 border-none"
                                      autoFocus
                                    />
                                  ) : (
                                    <span className="pl-3">{item.content}</span>
                                  )}
                                </div>
                              )}
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
                    <div className="flex gap-2 mt-4 mb-2 ml-1">
                      <span
                        className="cursor-pointer"
                        onClick={() => addElement(el, ind)}
                      >
                        <AiOutlinePlus />
                      </span>
                      <label className="cursor-pointer">
                        <input
                          className="hidden"
                          type="file"
                          onChange={(e) => uploadImage(e, el, ind)}
                        />
                        <BsImages />
                      </label>
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
          <button
            className="p-2 w-60 px-3 py-3 min-w-[250px] rounded-2xl duration-200 delay-75 bg-[#F1F2F4] hover:bg-gray-300 h-16 ease-out opacity-40"
            type="button"
            onClick={() => {
              !user &&
                setState([
                  ...state,
                  {
                    id: Date.now().toString(),
                    name: `Untitled ${state.length + 1}`,
                    notes: [],
                    isEditable: false,
                    index: state.length,
                  },
                ]);
              user && addNoteContainer();
            }}
          >
            <span className="opacity-100 text-black font-regular">
              + Add new list
            </span>
          </button>
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default NotesDisplay;