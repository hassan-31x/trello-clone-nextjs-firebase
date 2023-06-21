OLD CODE WITHOUTT LISTENERS
// const getUserNoteContainers = async (userId: string) => {
    //   setFetching(true);
    //   const userDocRef = doc(db, "users", userId);
    //   const noteContainerRef = collection(userDocRef, "noteContainer");
    //   const noteContainerQuerySnapshot = await getDocs(noteContainerRef);

    //   try {
    //     const noteContainers: INotesList[] = [];

    //     await Promise.all(
    //       noteContainerQuerySnapshot.docs.map(async (noteContainerDoc) => {
    //         const noteContainerData = noteContainerDoc.data();
    //         const noteContainer: INotesList = {
    //           id: noteContainerDoc.id.toString(),
    //           name: noteContainerData.name,
    //           notes: [],
    //           isEditable: noteContainerData.isEditable,
    //           index: noteContainerData.index,
    //         };

    //         const notesRef = collection(noteContainerDoc.ref, "notes");
    //         const notesQuerySnapshot = await getDocs(notesRef);

    //         notesQuerySnapshot.forEach((noteDoc) => {
    //           const noteData = noteDoc.data();
    //           const note: INote = {
    //             id: noteDoc.id,
    //             content: noteData.content,
    //             isEditable: noteData.isEditable,
    //             index: noteData.index,
    //           };

    //           noteContainer.notes.push(note);
    //         });

    //         noteContainers.push(noteContainer);
    //       })
    //     );

    //     // Sort noteContainers based on the index
    //     noteContainers.sort((a, b) => a.index - b.index);

    //     // Sort notes array inside each container based on the index
    //     noteContainers.forEach((container) => {
    //       container.notes.sort((a, b) => a.index - b.index);
    //     });

    //     setFetching(false);
    //     setTimeout(() => {
    //       setState(noteContainers);
    //     }, 200);
    //     console.log(noteContainers);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }







    const getUserNoteContainers = (userId: string) => {
      // setFetching(true);
      console.log('ran')
      console.log(state)
      const userDocRef = doc(db, "users", userId);
      const noteContainerRef = collection(userDocRef, "noteContainer");

      onSnapshot(noteContainerRef, (snapshot) => {
        const noteContainers: INotesList[] = [];

        snapshot.forEach((noteContainerDoc) => {
          const noteContainerData = noteContainerDoc.data();
          const noteContainer: INotesList = {
            id: noteContainerDoc.id.toString(),
            name: noteContainerData.name,
            notes: [],
            isEditable: noteContainerData.isEditable,
            index: noteContainerData.index,
          };

          const notesRef = collection(noteContainerDoc.ref, "notes");

          const notesUnsubscribe = onSnapshot(notesRef, (notesSnapshot) => {
            noteContainer.notes = [];

            notesSnapshot.forEach((noteDoc) => {
              const noteData = noteDoc.data();
              const note: INote = {
                id: noteDoc.id,
                content: noteData.content,
                isEditable: noteData.isEditable,
                index: noteData.index,
              };

              noteContainer.notes.push(note);
            });

            // Sort notes array inside the container based on the index
            noteContainer.notes.sort((a, b) => a.index - b.index);

            // Update the noteContainers array with the updated noteContainer
            const existingContainerIndex = noteContainers.findIndex(
              (container) => container.id === noteContainer.id
            );
            if (existingContainerIndex !== -1) {
              noteContainers[existingContainerIndex] = noteContainer;
            } else {
              noteContainers.push(noteContainer);
            }

            // Sort noteContainers based on the index
            noteContainers.sort((a, b) => a.index - b.index);

            // Update the component state with the updated noteContainers
            // setFetching(false);
            // setTimeout(() => {
              setState(noteContainers);
            // }, 200);
            console.log(noteContainers, state)
          });

          // Clean up the snapshot listener for notes when the noteContainer is removed
          const containerUnsubscribe = onSnapshot(
            noteContainerDoc.ref,
            (containerSnapshot) => {
              if (!containerSnapshot.exists()) {
                // Remove the noteContainer from the noteContainers array
                const containerIndex = noteContainers.findIndex(
                  (container) => container.id === noteContainer.id
                );
                if (containerIndex !== -1) {
                  noteContainers.splice(containerIndex, 1);
                  setState(noteContainers);
                }
                containerUnsubscribe(); // Stop listening to changes for this noteContainer
                notesUnsubscribe(); // Stop listening to changes for the notes inside this noteContainer
              }
            }
          );
        });

        setFetching(false);
      });
    };





      useEffect(() => {
    

    const getUserNoteContainers = (userId: string) => {
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
              notesQuerySnapshot.docs.forEach((noteDoc) => {
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
            // const notesUnsubscribe = onSnapshot(notesRef, (notesSnapshot) => {
            //   noteContainer.notes = [];
      
            //   notesSnapshot.forEach((noteDoc) => {
            //     const noteData = noteDoc.data();
            //     const note: INote = {
            //       id: noteDoc.id,
            //       content: noteData.content,
            //       isEditable: noteData.isEditable,
            //       index: noteData.index,
            //     };
      
            //     noteContainer.notes.push(note);
            //   });
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
          console.log(noteContainers, state);

          // Clean up the snapshot listener for notes when the noteContainer is removed
          // const containerUnsubscribe = onSnapshot(
          //   noteContainerDoc.ref,
          //   (containerSnapshot) => {
          //     if (!containerSnapshot.exists()) {
          //       // Remove the noteContainer from the noteContainers array
          //       const containerIndex = noteContainers.findIndex(
          //         (container) => container.id === noteContainer.id
          //       );
          //       if (containerIndex !== -1) {
          //         noteContainers.splice(containerIndex, 1);
          //         setState(noteContainers);
          //       }
          //       containerUnsubscribe(); // Stop listening to changes for this noteContainer
          //       notesUnsubscribe(); // Stop listening to changes for the notes inside this noteContainer
          //     }
          //   }
          // );
        } catch (err) {
          console.log(err);
        }
      });
    };

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