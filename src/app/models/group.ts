import { Task } from "./task";
import { User } from "./user";

export interface Group {
    id: number,
    name: string,
    teacher: User,
    tasks: Task[]
}