export interface Block {
    id: number;
    type: string;
    text: string;
    color: string;
    include: Block[];
    numberOfRepeats?: number;
}