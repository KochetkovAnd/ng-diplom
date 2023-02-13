import { Group } from "./group";

export interface User {
    id: number,
    name: string,
    role: string,
    group?: Group
}