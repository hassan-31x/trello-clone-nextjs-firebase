import { onSnapshot } from "firebase/firestore";

const Temp = () => {
  const getUserNoteContainer = (userId: string) => {
    // setFetching(true);
    const userDocRef = doc(db, "users", userId);
    const noteContainerRef = collection(userDocRef, "noteContainer");
    onSnapshot(noteContainerRef, (noteContainerQuerySnapshot) => {
      try {
        const noteContainers: INotesList[] = [];

        noteContainerQuerySnapshot.docs.map((noteContainerDoc) => {
          const noteContainerData = noteContainerDoc.data();
          const noteContainer: INotesList = {
            id: noteContainerDoc.id.toString(),
            name: noteContainerData.name,
            notes: [],
            isEditable: noteContainerData.isEditable,
            index: noteContainerData.index,
          };

          const notesRef = collection(noteContainerDoc.ref, "notes");
          onSnapshot(notesRef, (notesQuerySnapshot) => {
            notesQuerySnapshot.forEach((noteDoc) => {
              const noteData = noteDoc.data();
              const note: INote = {
                id: noteDoc.id,
                content: noteData.content,
                isEditable: noteData.isEditable,
                index: noteData.index,
              };

              noteContainer.notes.push(note);
            });
          });
          noteContainers.push(noteContainer);
        });

        // Sort noteContainers based on the index
        noteContainers.sort((a, b) => a.index - b.index);

        // Sort notes array inside each container based on the index
        noteContainers.forEach((container) => {
          container.notes.sort((a, b) => a.index - b.index);
        });

        // setFetching(false);
        // setTimeout(() => {
          setState(noteContainers);
        // }, 200);
        console.log(noteContainers);
      } catch (err) {
        console.log(err);
      }
    });
  };

  return <div>Temp</div>;
};

export default Temp;
