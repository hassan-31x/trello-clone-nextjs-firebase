export interface Note {
    id: string;
    content: string;
    isEditable: boolean;
}
  
export interface NotesList {
    name: string;
    id: number;
    notes: Note[],
    isEditable: boolean;
}