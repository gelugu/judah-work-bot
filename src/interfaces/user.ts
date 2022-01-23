import { Session } from "./session";

export interface User {
  currentSession?: number;
  sessions?: Session[];
}