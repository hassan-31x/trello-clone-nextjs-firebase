import { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Gradient from "./Gradient";
import NoteList2 from "./NoteList2";

const NotesDisplay2 = () => {
  const handleOnDragEnd = (result: DropResult) => {};
  const [notesDisplay, setNotesDisplay] = useState([
    {
      name: "todo",
      value: {
        id: "todo",
        todos: ["todo1", "todo2", "todo3", "todo4", "todo5"],
      },
    },
    {
      name: "doing",
      value: {
        id: "doing",
        todos: ["doing1", "doing2"],
      },
    },
    {
      name: "done",
      value: {
        id: "done",
        todos: ["done1", "done2", "done3"],
      },
    },
  ]);
  console.log(notesDisplay)
  setNotesDisplay([
    {
      name: "todo",
      value: {
        id: "todo",
        todos: ["todo1", "todo2", "todo3", "todo4", "todo5"],
      },
    },
    {
      name: "doing",
      value: {
        id: "doing",
        todos: ["doing1", "doing2"],
      },
    },
    {
      name: "done",
      value: {
        id: "done",
        todos: ["done1", "done2", "done3"],
      },
    },
  ]);

  return (
    <section className="grow bg-blue-800">
      <Gradient />

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {notesDisplay.map((note, index) => (
                <NoteList2
                  key={note.name}
                  index={index}
                  id={note.name}
                  todos={note.value.todos}
                />
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
};

export default NotesDisplay2;
