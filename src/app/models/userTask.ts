import { Task } from "./task";
import { User } from "./user";

export interface UserTask {
    user?: User,
    task: Task,
    solved: boolean,
    solution: string;
}