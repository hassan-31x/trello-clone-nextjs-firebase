export interface INote {
    id: string;
    content: string;
    isEditable: boolean; 
}
  
export interface INotesList {
    name: string;
    id: string;
    notes: INote[],
    isEditable: boolean;
} 