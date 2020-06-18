export interface Device {
    model: string;
    uuid: number;
    vendor: string;
    version: string;
    description?: string;
    hostname?: string;
    mgmt_address?: string;
    network_port?: string;
    credential_details?: { id: number; username: string; password: string }[];
    subrack_details?: { id: number | string }[];
}
