import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Device } from "../../interfaces/device.interface";
import { Profile } from "../../interfaces/profile.interface";
import { Subrack } from "../../interfaces/subrack.interface";
import { map } from "rxjs/operators";
import { Card } from "../../interfaces/card.interface";
import { Port } from "../../interfaces/port.interface";
import { Ont } from "../../interfaces/ont.interface";

@Injectable({
    providedIn: "root",
})
export class ApiService {
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
        // Get Devices on start up
        this.getDevices().subscribe({
            next: (devices) => {
                // Store Devices
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
            error: () => {
                throw new Error("An Error occurred trying to request Devices");
            },
        });
    }

    /**
     * Get array of all created Devices
     */
    public getDevices(): Observable<Device[]> {
        return this.http.get<{ count: number; members: Device[] }>("boxen").pipe(map((res) => res.members));
    }

    /**
     * Get Device by its id
     * @param id Id of the device to get
     */
    public getDevice(id: number | string): Observable<Device> {
        return this.http.get<Device>(`boxen/${id}`);
    }

    /**
     * Returns the name of a Device from its id
     * @param id Id of the device to get name for
     */
    public getDeviceName(id: number | string): string {
        const device = this.devices.find((device) => device.uuid === id);
        return device ? `${device.vendor} ${device.model} ${device.version}` : "DEVICE NOT FOUND";
    }

    /**
     * Get Profiles for specific Device
     * @param deviceId Id of the Device to get Profiles for
     */
    public getProfiles(deviceId: number | string): Observable<Profile[]> {
        return this.http.get<{ count: number; members: Profile[] }>(`boxen/${deviceId}/port_profiles`).pipe(map((res) => res.members));
    }

    /**
     * Get specific Profile from specific Device
     * @param deviceId Id of the Device to get Profile for
     * @param profileId Id of the Profile to get
     */
    public getProfile(deviceId: number | string, profileId: number | string): Observable<Profile> {
        return this.http.get<Profile>(`boxen/${deviceId}/port_profiles/${profileId}`);
    }

    /**
     * Get list of Subracks inside Device
     * @param deviceId Id of the Device to get Subracks for
     */
    public getSubracks(deviceId: number | string): Observable<Subrack[]> {
        return this.http.get<{ count: Number; members: Subrack[] }>(`boxen/${deviceId}/subracks`).pipe(map((res) => res.members));
    }

    /**
     * Get a Subrack by its Id
     * @param deviceId Id of the Device which holds the Subrack
     * @param subrackId Id of the Subrack to get
     */
    public getSubrack(deviceId: number | string, subrackId: number | string): Observable<Subrack> {
        return this.http.get<Subrack>(`boxen/${deviceId}/subracks/${subrackId}`);
    }

    /**
     * Get list of Cards inside specific Subrack of a Device
     * @param deviceId Id of the Device which holds the Cards
     * @param subrackId Id of the Subrack which holds the Cards
     */
    public getCards(deviceId: number | string, subrackId: number | string): Observable<{ id: number }[]> {
        return this.http
            .get<{ count: number; members: { id: number }[] }>(`boxen/${deviceId}/cards`, {
                params: {
                    subrack_id: subrackId.toString(),
                },
            })
            .pipe(map((res) => res.members));
    }

    /**
     * Get a Card by its Id
     * @param deviceId Id of the Device which holds the Card
     * @param cardId Id of the Card to get
     */
    public getCard(deviceId: number | string, cardId: number | string): Observable<Card> {
        return this.http.get<Card>(`boxen/${deviceId}/cards/${cardId}`);
    }

    /**
     * Get a list of all Ports of a Card
     * @param deviceId Id of the Device which holds the Card
     * @param cardId Id of the Card to get Ports for
     */
    public getPorts(deviceId: number | string, cardId: number | string): Observable<{ id: number }[]> {
        return this.http
            .get<{ count: number; members: { id: number }[] }>(`boxen/${deviceId}/ports`, {
                params: {
                    card_id: cardId.toString(),
                },
            })
            .pipe(map((res) => res.members));
    }

    /**
     * Get a Port by its Id
     * @param deviceId Id of the Device which contains the Port
     * @param portId Id of the Port to get
     */
    public getPort(deviceId: number | string, portId: number | string): Observable<Port> {
        return this.http.get<Port>(`boxen/${deviceId}/ports/${portId}`);
    }

    /**
     * Get a list of ONTs attached to a Port
     * @param deviceId Id of the Device containing the ONTs
     * @param portId Id of the Port the ONT is attached to
     */
    public getOnts(deviceId: number | string, portId: number | string): Observable<{ id: number }[]> {
        return this.http
            .get<{ count: number; members: { id: number }[] }>(`boxen/${deviceId}/onts`, {
                params: {
                    port_id: portId.toString(),
                },
            })
            .pipe(map((res) => res.members));
    }

    /**
     * Get an ONT by its Id
     * @param deviceId Id of the Device containing the ONT
     * @param ontId Id of the ONT to get
     */
    public getOnt(deviceId: number | string, ontId: number | string): Observable<Ont> {
        return this.http.get<Ont>(`boxen/${deviceId}/onts/${ontId}`);
    }

    /**
     * Get a list of ONT Ports of an ONT
     * @param deviceId Id of the Device containing the ONT Ports
     * @param ontId Id of the ONT holding the ONT Port
     */
    public getOntPorts(deviceId: number | string, ontId: number | string): Observable<{ id: number }[]> {
        return this.http
            .get<{ count: number; members: { id: number }[] }>(`boxen/${deviceId}/ont_ports`, {
                params: {
                    ont_id: ontId.toString(),
                },
            })
            .pipe(map((res) => res.members));
    }

    /**
     * Get an ONT Port by its Id
     * @param deviceId Id of the Device containing the ONT Port
     * @param ontPortId Id of the ONT Port to get
     */
    public getOntPort(deviceId: number | string, ontPortId: number | string): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(`boxen/${deviceId}/ont_ports/${ontPortId}`);
    }

    /**
     * Get a list of CPEs attached to given ONT Port
     * @param deviceId Id of the device containing the CPEs
     * @param ontPortId Id of the ONT Port to get CPEs for
     */
    public getCpes(deviceId: number | string, ontPortId: number | string): Observable<{ id: number }[]> {
        return this.http
            .get<{ count: number; members: { id: number }[] }>(`boxen/${deviceId}/cpes`, {
                params: {
                    ont_port_id: ontPortId.toString(),
                },
            })
            .pipe(map((res) => res.members));
    }

    /**
     * Get a CPE by its Id
     * @param deviceId Id of the Device containing the CPE
     * @param cpeId Id of the CPE to get
     */
    public getCpe(deviceId: number, cpeId: number): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(`boxen/${deviceId}/cpes/${cpeId}`);
    }

    /**
     * Get CPE Ports of a specific CPE
     * @param deviceId Id of the Device which contains teh CPE
     * @param cpeId Id of the CPE of the Ports we want to get
     */
    public getCpePorts(deviceId: number, cpeId: number): Observable<{ id: number }[]> {
        return this.http
            .get<{ count: number; members: { id: number }[] }>(`boxen/${deviceId}/cpe_ports`, {
                params: {
                    cpe_id: cpeId.toString(),
                },
            })
            .pipe(map((res) => res.members));
    }

    /**
     * Get a CPE Port of a specific CPE by its Id
     * @param deviceId Id of the Device containing the CPE Port
     * @param cpePortId Id of the CPE Port to get
     */
    public getCpePort(deviceId: number, cpePortId: number): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(`boxen/${deviceId}/cpe_ports/${cpePortId}`);
    }

    /**
     * Get a list of V-Lans of a Device
     * @param deviceId Id of the Device to get V-Lans for
     */
    public getVlans(deviceId: number): Observable<{ id: number }[]> {
        return this.http.get<{ count: number; members: { id: number }[] }>(`boxen/${deviceId}/vlans`).pipe(map((res) => res.members));
    }

    /**
     * Get a V-Lan by its Id
     * @param deviceId Id of the Device containing the V-Lan
     * @param vlanId Id of the V-Lan to get
     */
    public getVlan(deviceId: number, vlanId: number): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(`boxen/${deviceId}/vlans/${vlanId}`, {});
    }

    /**
     * Get a list of V-Lan Connections for a Device
     * @param deviceId Id of the Device holding the V-Lan Connections
     * @param vlanId Id of the V-Lan we want to get the Connections of
     */
    public getVlanConnections(deviceId: number, vlanId: number): Observable<{ id: number }[]> {
        return this.http
            .get<{ count: number; members: { id: number }[] }>(`boxen/${deviceId}/vlan_connections`, {
                params: {
                    vlan_id: vlanId.toString(),
                },
            })
            .pipe(map((res) => res.members));
    }

    /**
     * Get a V-Lan Connection by its Id
     * @param deviceId Id of the Device containing the V-Lan Connection
     * @param vlanConnectionId Id of the V-Lan Connection to get
     */
    public getVlanConnection(deviceId: number, vlanConnectionId: number): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(`boxen/${deviceId}/vlan_connections/${vlanConnectionId}`);
    }

    /**
     * Get a list of Port Profiles of a given Device
     * @param deviceId Id of the Device to get Port Profile for
     */
    public getPortProfiles(deviceId: number): Observable<{ id: number }[]> {
        return this.http
            .get<{ count: number; members: { id: number }[] }>(`boxen/${deviceId}/port_profiles`)
            .pipe(map((res) => res.members));
    }

    /**
     * Get a Port Profile by its Id
     * @param deviceId Id of the Device containing the Port Profile
     * @param portProfileId Id of the Port Profile to get
     */
    public getPortProfile(deviceId: number, portProfileId: number): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(`boxen/${deviceId}/port_profiles/${portProfileId}`);
    }

    /**
     * Get a list of Port Profile Connections of a Device
     * @param deviceId Id of the Device to get Port Profile Connections for
     */
    public getPortProfileConnections(deviceId: number): Observable<{ id: string }[]> {
        return this.http
            .get<{ count: number; members: { id: string }[] }>(`boxen/${deviceId}/port_profile_connections`)
            .pipe(map((res) => res.members));
    }

    /**
     * Get a Port Profile Connection by its Id
     * @param deviceId Id of the Device which contains Port Profile Connection
     * @param portProfileConnectionId Id of the Port Profile Connection to get
     */
    public getPortProfileConnection(deviceId: number, portProfileConnectionId: number): Observable<{ [key: string]: any }> {
        return this.http.get<{ [key: string]: any }>(`boxen/${deviceId}/port_profile_connections/${portProfileConnectionId}`);
    }

    /**
     * Run a command inside a Terminal session
     * @param command Command to run inside Terminal
     *
     * TODO: Placeholder function to simulate usability
     */
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
