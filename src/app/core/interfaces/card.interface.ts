import { Port } from "./port.interface";

export interface Card {
    [key: string]: any;
    ports: Port[];
    ppc: number;
}
