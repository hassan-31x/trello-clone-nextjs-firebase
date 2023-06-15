export interface INote {
    id: string;
    content: string;
    isEditable: boolean; 
}
  
export interface INotesList {
    name: string;
    id: number;
    notes: INote[],
    isEditable: boolean;
}