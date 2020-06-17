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
    /**
     * Credentials object retrieved from LocalStorage
     */
    public credentials: Credentials;

    /**
     * Array of created Devices
     */
    public devices: Device[] = [];

    /**
     * Array of vendor names as strings, used to categorize devices by vendors
     */
    public vendorNames: string[] = [];

    /**
     * Vendors object where vendor names are keys and arrays of devices as values
     */
    public vendors: { [key: string]: { devices: Device[] } } = {};

    constructor(private http: HttpClient) {
        // Get Credentials from LocalStorage
        this.getStoredCredentials().subscribe({
            next: (credentials) => {
                console.log(credentials);
            },
            error: (error) => {
                console.log(error);
            },
        });

        // Get devices from API
        this.getDevices().subscribe({
            next: (devices) => {
                this.devices = devices;

                // Parse devices into vendors array and object
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

    /**
     * Get array of all created devices from API
     */
    public getDevices(): Observable<Device[]> {
        return this.http
            .get<{ count: number; members: Device[] }>(`${this.credentials.requestUrl}/softboxen/v1/boxen`, {
                headers: this.credentials.requestHeaders,
            })
            .pipe(map((res) => res.members));
    }

    public getDevice(id: number | string): Observable<Device> {
        return this.http.get<Device>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${id}`, {
            headers: this.credentials.requestHeaders,
        });
    }

    public getDeviceName(id: number | string): string {
        const device = this.devices.find((device) => device.uuid === id);
        return device ? `${device.vendor} ${device.model} ${device.version}` : "DEVICE NOT FOUND";
    }

    public getProfiles(deviceId: number | string): Observable<Profile[]> {
        return this.http
            .get<{ count: number; members: Profile[] }>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/port_profiles`, {
                headers: this.credentials.requestHeaders,
            })
            .pipe(map((res) => res.members));
    }

    public getProfile(deviceId: number | string, profileId: number | string): Observable<Profile> {
        return this.http.get<Profile>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/port_profiles/${profileId}`, {
            headers: this.credentials.requestHeaders,
        });
    }

    public getSubracks(deviceId: number | string): Observable<Subrack[]> {
        return this.http
            .get<{ count: Number; members: Subrack[] }>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/subracks`, {
                headers: this.credentials.requestHeaders,
            })
            .pipe(map((res) => res.members));
    }

    public getSubrack(deviceId: number | string, subrackId: number | string): Observable<Subrack> {
        return this.http.get<Subrack>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/subracks/${subrackId}`, {
            headers: this.credentials.requestHeaders,
        });
    }

    public getCards(deviceId: number | string, subrackId: number | string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/cards`, {
                params: {
                    subrack_id: subrackId.toString(),
                },
                headers: this.credentials.requestHeaders,
            })
            .pipe(map((res) => res.members));
    }

    public getCard(deviceId: number | string, cardId: number | string): Observable<Card> {
        return this.http.get<Card>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/cards/${cardId}`, {
            headers: this.credentials.requestHeaders,
        });
    }

    public getPorts(deviceId: number | string, cardId: number | string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/ports`, {
                params: {
                    card_id: cardId.toString(),
                },
                headers: this.credentials.requestHeaders,
            })
            .pipe(map((res) => res.members));
    }

    public getPort(deviceId: number | string, portId: number | string): Observable<Port> {
        return this.http.get<Port>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/ports/${portId}`, {
            headers: this.credentials.requestHeaders,
        });
    }

    public getOnts(deviceId: number | string, portId: number | string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/onts`, {
                params: {
                    port_id: portId.toString(),
                },
                headers: this.credentials.requestHeaders,
            })
            .pipe(map((res) => res.members));
    }

    public getOnt(deviceId: number | string, ontId: number | string): Observable<Port> {
        return this.http.get<Port>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/onts/${ontId}`, {
            headers: this.credentials.requestHeaders,
        });
    }

    public getOntPorts(deviceId: number | string, ontId: number | string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/ont_ports`, {
                params: {
                    ont_id: ontId.toString(),
                },
                headers: this.credentials.requestHeaders,
            })
            .pipe(map((res) => res.members));
    }

    public getOntPort(deviceId: number | string, ontPortId: number | string): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(
            `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/ont_ports/${ontPortId}`,
            {
                headers: this.credentials.requestHeaders,
            },
        );
    }

    public getCpes(deviceId: number | string, ontPortId: number | string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/cpes`, {
                params: {
                    ont_port_id: ontPortId.toString(),
                },
                headers: this.credentials.requestHeaders,
            })
            .pipe(map((res) => res.members));
    }

    public getCpe(deviceId: number | string, cpeId: number | string): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/cpes/${cpeId}`, {
            headers: this.credentials.requestHeaders,
        });
    }

    public getCpePorts(deviceId: number | string, cpeId: number | string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/cpe_ports`, {
                params: {
                    cpe_id: cpeId.toString(),
                },
                headers: this.credentials.requestHeaders,
            })
            .pipe(map((res) => res.members));
    }

    public getCpePort(deviceId: number | string, cpePortId: number | string): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(
            `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/cpe_ports/${cpePortId}`,
            {
                headers: this.credentials.requestHeaders,
            },
        );
    }

    public getVlans(deviceId: number | string): Observable<{ id: number }[]> {
        return this.http
            .get<{ count: number; members: { id: number }[] }>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/vlans`, {
                headers: this.credentials.requestHeaders,
            })
            .pipe(map((res) => res.members));
    }

    public getVlan(deviceId: number | string, vlanId: number | string): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(`${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/vlans/${vlanId}`, {
            headers: this.credentials.requestHeaders,
        });
    }

    public getVlanConnections(deviceId: number | string, vlanId: number | string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/vlan_connections`,
                {
                    params: {
                        vlan_id: vlanId.toString(),
                    },
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getVlanConnection(deviceId: number | string, vlanConnectionId: number | string): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(
            `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/vlan_connections/${vlanConnectionId}`,
            {
                headers: this.credentials.requestHeaders,
            },
        );
    }

    public getPortProfiles(deviceId: number | string): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(
                `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/port_profiles`,
                {
                    headers: this.credentials.requestHeaders,
                },
            )
            .pipe(map((res) => res.members));
    }

    public getPortProfile(deviceId: number | string, portProfileId: number | string): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(
            `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/port_profiles/${portProfileId}`,
            {
                headers: this.credentials.requestHeaders,
            },
        );
    }

    public getPortProfileConnections(deviceId: number | string): Observable<{ id: string }[]> {
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
        deviceId: number | string,
        portProfileConnectionId: number | string,
    ): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(
            `${this.credentials.requestUrl}/softboxen/v1/boxen/${deviceId}/port_profile_connections/${portProfileConnectionId}`,
            {
                headers: this.credentials.requestHeaders,
            },
        );
    }

    public runCommand(command: string): Observable<string> {
        return new Observable((subscriber) => {
            // Return command to display it in terminal
            subscriber.next(`${command}`);

            switch (command) {
                case "tox -e example-restcli":
                    setTimeout(() => {
                        subscriber.next(`\n
 / ____|     /  _| | | |
| (___   ___ | |_| |_| |__   _____  _____ _ __
 \\___ \\ / _ \\|  _| __| '_ \\ / _ \\ \\/ / _ \\ '_ \\
 ____) | (_) | | | |_| |_) | (_) >  <  __/ | | |
|_____/ \\___/|_|  \\__|_.__/ \\___/_/\\_\\___|_| |_|
                       
Hint: login credentials: admin/secret

`);
                        subscriber.complete();
                    }, 1500);
                    return;

                case "login":
                    setTimeout(() => {
                        subscriber.next("Successfully logged in!");
                        subscriber.complete();
                    }, 1500);
                    return;

                default:
                    setTimeout(() => {
                        subscriber.next("Example response!");
                        subscriber.complete();
                    }, 1500);
                    return;
            }
        });
    }
}
