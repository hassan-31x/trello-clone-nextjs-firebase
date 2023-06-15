import { Draggable, Droppable } from "react-beautiful-dnd"

type notesListProps = {
    id: string,
    todos: string[],
    index: number
}

const NoteList2 = (props: notesListProps) => {
    console.log(props.id)
  return (
    <Draggable draggableId={props.id} index={props.index}>
        {(provided) => (
            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                <Droppable droppableId={props.index.toString()} type="card">
                    {(provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className={`p-2 rounded-2xl shadow-sm ${snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'}`}>
                            <h2>{props.id}</h2>
                            <span>{props.todos.length}</span>
                        </div>
                    )}
                </Droppable>
            </div>
        )}
    </Draggable>
  )
}

export default NoteList2