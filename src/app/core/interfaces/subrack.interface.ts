import { Card } from "./card.interface";

export interface Subrack {
    id: number;
    name?: string;
    planned_type?: string;
    actual_type?: string;
    admin_state?: string;
    operational_state?: string;
    err_state?: string;
    description?: string;
    serial_no?: string;
    ics?: string;
    mode?: string;
    subrack_class?: string;
    variant?: string;
    cards: Card[];
}
