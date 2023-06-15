import { useState } from "react";

import Gradient from "./Gradient";
import NotesList from "./NotesList";

const NotesDisplay = () => {
  const [notesDisplay, setNotesDisplay] = useState([
    {
      name: "todo",
      items: ["todo1", "todo2", "todo3", "todo4", "todo5"],
    },
    {
      name: "doing",
      items: ["doing1", "doing2"],
    },
    {
      name: "done",
      items: ["done1", "done2", "done3"],
    },
  ]);

  console.log("notesDisplay");
  setNotesDisplay([
    {
      name: "todo",
      items: ["todo1", "todo2", "todo3", "todo4", "todo5"],
    },
    {
      name: "doing",
      items: ["doing1", "doing2"],
    },
    {
      name: "done",
      items: ["done1", "done2", "done3"],
    },
  ]);

  return (
    <section className="grow bg-blue-800">
      <Gradient />

      <div className="px-5">
        <div className="flex flex-wrap gap-4">
          {notesDisplay.map((noteList, index) => {
            return <NotesList noteList={noteList} key={index} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default NotesDisplay;
