export interface INote {
    id: string;
    content: string;
    isEditable: boolean; 
    index: number
}
  
export interface INotesList {
    name: string;
    id: string;
    notes: INote[],
    isEditable: boolean;
    index: number
} 