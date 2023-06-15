import { BiDotsHorizontalRounded } from "react-icons/bi";

type notesListProps = {
  noteList: {
    name: string;
    items: string[];
  };
};

const NotesList = (props: notesListProps) => {
  return (
    <div className="notelist bg-[#F1F2F4] px-3 py-3 min-w-[250px] rounded-2xl duration-150 delay-200">
      <div className="heading flex justify-between h-4 items-center pl-3 pr-1">
        <p className="text-sm font-medium text-gray-800">
          {props.noteList.name}
        </p>
        <BiDotsHorizontalRounded />
      </div>
      <div className="text-xs font-light py-1 px-3">
        {props.noteList.items.length} cards
      </div>

      <div className="py-2">
        {props.noteList.items.map((item, index) => {
          return (
            <div
              key={index}
              className="note bg-white w-full rounded-xl my-2 h-9 flex items-center px-3 py-2"
              draggable={true}
            >
              <p className="text-xs font-medium text-gray-800">{item}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotesList;
