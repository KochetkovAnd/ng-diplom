import { User } from "./user";

export interface Task {
    id: number,
    owner: User,
    n: number,
    m: number,
    grid: string,
    x: number,
    y: number,
    angle: number
}