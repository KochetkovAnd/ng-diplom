export interface Block {
    type: string;
    text: string;
    color: string;
    include: Block[];
    numberofRepeates?: number;
}