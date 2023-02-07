import { Group } from "./group";

export interface User {
    name: string,
    role: string,
    group?: Group
}