import { Processable } from "../Processable";

export interface Action<> {
  name: string;
  description: string;
  result?: Processable[];
}
