import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Credentials } from "../../interfaces/credentials.interface";
import { Device } from "../../interfaces/device.interface";
import { Profile } from "../../interfaces/profile.interface";
import { Subrack } from "../../interfaces/subrack.interface";
import { map } from "rxjs/operators";
import { Card } from "../../interfaces/card.interface";
import { Port } from "../../interfaces/port.interface";

@Injectable({
    providedIn: "root",
})
export class ApiService {
    public credentials: Credentials;

    public devices: Device[] = [];
    public vendorNames: string[] = [];
    public vendors: { [key: string]: { devices: Device[] } } = {};

    constructor(private http: HttpClient) {
        this.getStoredCredentials().subscribe({
            next: (credentials) => {
                console.log(credentials);
            },
            error: (error) => {
                console.log(error);
            },
        });

        this.getDevices().subscribe({
            next: (devices) => {
                this.devices = devices;
                devices.map((device) => {
                    if (!this.vendorNames.includes(device.vendor)) {
                        this.vendorNames.push(device.vendor);
                        this.vendors[device.vendor] = { devices: [] };
                        this.vendors[device.vendor].devices = [device];
                    } else {
                        this.vendors[device.vendor].devices.push(device);
                    }
                });
            },
            error: (error) => {
                console.error(error);
            },
        });
    }

    /**
     * Checks for Credentials object stored inside localStorage
     */
    public getStoredCredentials(): Observable<Credentials> {
        return new Observable((subscriber) => {
            let credentials: string = localStorage.getItem("credentials");

            if (credentials) {
                try {
                    const parsed: Credentials = JSON.parse(credentials);

                    this.credentials = parsed;
                    this.credentials.requestUrl = `${parsed.protocol}://${parsed.host}:${parsed.port}`;
                    this.credentials.requestHeaders = new HttpHeaders().append(
                        "Authorization",
                        `Basic ${btoa(`${parsed.auth.username}:${parsed.auth.password}`)}`,
                    );

                    subscriber.next(parsed);
                    subscriber.complete();
                } catch (error) {
                    console.error("Error parsing `credentials` item from localStorage");
                    subscriber.error(error);
                    subscriber.complete();
                }
            } else {
                console.warn("No `credentials` item found in localStorage.");
                subscriber.error();
                subscriber.complete();
            }
        });
    }

    public getDevices(): Observable<Device[]> {
        return this.http
            .get<{ count: number; members: Device[] }>(`${this.credentials.requestUrl}/softboxen/v1/boxen`, {
                headers: this.credentials.requestHeaders,
            })
            .pipe(map((res) => res.members));
    }

    public getDevice(id: string): Observable<Device> {
        return this.http.get<Device>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${id}`, {
            headers: this.credentials.requestHeaders,
        });
    }

    public getDeviceName(id: string): string {
        const device = this.devices.find((device) => device.uuid === id);
        return device ? `${device.vendor} ${device.model} ${device.version}` : "DEVICE NOT FOUND";
    }

    public getProfiles(deviceId: string): Observable<Profile[]> {
        return this.http
            .get<{ count: number; members: Profile[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/port_profiles`,
                {
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getSubracks(deviceId: string): Observable<Subrack[]> {
        return this.http
            .get<{ count: Number; members: Subrack[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/subracks`,
                {
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getSubrack(deviceId: string, subrackId: string): Observable<Subrack> {
        return this.http.get<Subrack>(
            `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/subracks/${subrackId}`,
            {
                headers: this.credentials.requestHeaders,
            },
        );
    }

    public getCards(deviceId: string, subrackId: string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/cards`,
                {
                    params: {
                        subrack_id: subrackId,
                    },
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getCard(deviceId: string, cardId: string): Observable<Card> {
        return this.http.get<Card>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/cards/${cardId}`, {
            headers: this.credentials.requestHeaders,
        });
    }

    public getPorts(deviceId: string, cardId: string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/ports`,
                {
                    params: {
                        card_id: cardId,
                    },
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getPort(deviceId: string, portId: string): Observable<Port> {
        return this.http.get<Port>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/ports/${portId}`, {
            headers: this.credentials.requestHeaders,
        });
    }

    public getOnts(deviceId: string, portId: string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/onts`,
                {
                    params: {
                        port_id: portId,
                    },
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getOnt(deviceId: string, ontId: string): Observable<Port> {
        return this.http.get<Port>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/onts/${ontId}`, {
            headers: this.credentials.requestHeaders,
        });
    }

    public getOntPorts(deviceId: string, ontId: string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/ont_ports`,
                {
                    params: {
                        ont_id: ontId,
                    },
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getOntPort(deviceId: string, ontPortId: string): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(
            `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/ont_ports/${ontPortId}`,
            {
                headers: this.credentials.requestHeaders,
            },
        );
    }

    public getCpes(deviceId: string, ontPortId: string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/cpes`,
                {
                    params: {
                        ont_port_id: ontPortId,
                    },
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getCpe(deviceId: string, cpeId: string): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(
            `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/cpes/${cpeId}`,
            {
                headers: this.credentials.requestHeaders,
            },
        );
    }

    public getCpePorts(deviceId: string, cpeId: string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/cpe_ports`,
                {
                    params: {
                        cpe_id: cpeId,
                    },
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getCpePort(deviceId: string, cpePortId: string): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(
            `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/cpe_ports/${cpePortId}`,
            {
                headers: this.credentials.requestHeaders,
            },
        );
    }

    public getVlans(deviceId: string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/vlans`,
                {
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getVlan(deviceId: string, vlanId: string): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(
            `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/vlans/${vlanId}`,
            {
                headers: this.credentials.requestHeaders,
            },
        );
    }

    public getVlanConnections(deviceId: string, vlanId: string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/vlan_connections`,
                {
                    params: {
                        vlan_id: vlanId,
                    },
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getVlanConnection(deviceId: string, vlanConnectionId: string): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(
            `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/vlan_connections/${vlanConnectionId}`,
            {
                headers: this.credentials.requestHeaders,
            },
        );
    }

    public getPortProfiles(deviceId: string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/port_profiles`,
                {
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getPortProfile(deviceId: string, portProfileId: string): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(
            `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/port_profiles/${portProfileId}`,
            {
                headers: this.credentials.requestHeaders,
            },
        );
    }

    public getPortProfileConnections(deviceId: string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/port_profile_connections`,
                {
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getPortProfileConnection(
        deviceId: string,
        portProfileConnectionId: string,
    ): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(
            `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/port_profile_connections/${portProfileConnectionId}`,
            {
                headers: this.credentials.requestHeaders,
            },
        );
    }
}
