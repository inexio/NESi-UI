export interface Device {
    model: string;
    uuid: string;
    vendor: string;
    version: string;
    description?: string;
    hostname?: string;
    mgmt_address?: string;
    network_port?: string;
    credentials?: { id: string; username: string; password: string }[];
}
