export interface Device {
    model: string;
    uuid: string;
    vendor: string;
    version: string;
    description?: string;
    hostname?: string;
    mgmt_address?: string;
}
