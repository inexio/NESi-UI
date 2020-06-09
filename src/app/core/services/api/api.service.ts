import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Credentials } from "../../interfaces/credentials.interface";
import { Device } from "../../interfaces/device.interface";
import { Profile } from "../../interfaces/profile.interface";
import { Subrack } from "../../interfaces/subrack.interface";
import { map } from "rxjs/operators";
import { Card } from "../../interfaces/card.interface";

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
}
