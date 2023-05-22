export interface INoteData {
  text: string;
  timeStamp: number;
  completed: boolean;
  color: string;
}

export interface INote extends INoteData {
  _id: string;
}
