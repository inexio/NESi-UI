import { HttpHeaders } from "@angular/common/http";

export interface Credentials {
    protocol: "http" | "https";
    host: string;
    port: string;
    auth: {
        type: "basic";
        username: string;
        password: string;
    };
    requestUrl?: string;
    requestHeaders?: HttpHeaders;
}
