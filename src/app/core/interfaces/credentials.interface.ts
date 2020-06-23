import { HttpHeaders } from "@angular/common/http";

export interface Credentials {
    protocol: "http" | "https";
    host: string;
    port: string;
    auth: {
        enabled?: boolean;
        type: "basic" | "header";
        username: string;
        password: string;
    };
    requestUrl?: string;
    requestHeaders?: HttpHeaders;
}
