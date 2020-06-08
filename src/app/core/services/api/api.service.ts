import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Credentials } from "../../interfaces/credentials.interface";
import { Device } from "../../interfaces/device.interface";
import { Profile } from "../../interfaces/profile.interface";
import { Subrack } from "../../interfaces/subrack.interface";

import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class ApiService {
    public credentials: Credentials;

    constructor(private http: HttpClient) {
        this.getStoredCredentials().subscribe({
            next: (credentials) => {
                console.log(credentials);
            },
            error: (error) => {
                console.log(error);
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
}
