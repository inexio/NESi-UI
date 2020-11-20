import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, ObservableInput } from "rxjs";
import { Device } from "../../interfaces/device.interface";
import { Profile } from "../../interfaces/profile.interface";
import { Subrack } from "../../interfaces/subrack.interface";
import { map, delay } from "rxjs/operators";
import { Card } from "../../interfaces/card.interface";
import { Port } from "../../interfaces/port.interface";
import { Ont } from "../../interfaces/ont.interface";
import { Vendors } from "../../interfaces/vendors.interface";

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

    /**
     * Array of Terminal sessions
     */
    public terminalSessions: { id: number; deviceId: number }[] = [
        // {
        //     id: 1,
        //     deviceId: 1,
        // },
    ];

    constructor(private http: HttpClient) {
        // Get Devices on start up
        this.getDevices().subscribe({
            error: () => {
                throw new Error("An Error occurred trying to request Devices");
            },
        });
    }

    /**
     * Get array of all created Devices
     */
    public getDevices(): Observable<Device[]> {
        return this.http.get<{ count: number; members: Device[] }>("boxen").pipe(
            map((res) => {
                // Store devices inside service
                this.devices = res.members;

                // Clear Device list
                this.vendorNames = [];
                this.vendors = {};

                // Parse devices into vendors array and object
                res.members.map((device) => {
                    if (!this.vendorNames.includes(device.vendor)) {
                        this.vendorNames.push(device.vendor);
                        this.vendors[device.vendor] = { devices: [device] };
                    } else {
                        this.vendors[device.vendor].devices.push(device);
                    }
                });

                return res.members;
            }),
        );
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
        const device = this.devices.find((device) => device.id === id);
        return device ? `${device.vendor} ${device.model} ${device.version}` : "DEVICE NOT FOUND";
    }

    /**
     * Create a new device with given vendor, model and version
     * @param device Device object containing vendor, model and version
     */
    public createDevice(device: { vendor: string; model: string; version: string }): Observable<Device> {
        return this.http.post<Device>("boxen", device);
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
     * Get specific User from specific Device
     * @param deviceId Id of the Device to get User for
     * @param userId Id of the User to get
     */
    public getUser(deviceId: number | string, userId: number | string): Observable<Profile> {
        return this.http.get<Profile>(`boxen/${deviceId}/users/${userId}`);
    }

    /**
     * Create a new User for a specific Device
     * @param deviceId Id of the Device to create the User for
     * @param user User object containing all necessary data for the new User
     */
    public createUser(
        deviceId: number | string,
        user: {
            name: string;
            profile: "root" | "admin" | "operator" | "commonuser";
            level: "Super" | "Admin" | "Operator" | "User";
        },
    ): Observable<any> {
        return this.http.post(`boxen/${deviceId}/users`, user);
    }

    /**
     * Update the `lock_status` of a specific User
     * @param deviceId Id of the Device to update the User for
     * @param userId Id of the User to update
     * @param lockStatus New locked
     */
    public updateUserLockStatus(deviceId: number | string, userId: number | string, lockStatus: "locked" | "unlocked"): Observable<any> {
        return this.http.put(`boxen/${deviceId}/users/${userId}`, { lock_status: lockStatus });
    }

    /**
     * Create a new pair of Credentials for a specific User
     * @param deviceId Id of the Device which holds the User
     * @param userId Id of the User to add the Credentials to
     * @param credentials Object containing the username and password of the new Credentials pair
     */
    public createCredentials(
        deviceId: number | string,
        userId: number | string,
        credentials: { username: string; password: string },
    ): Observable<any> {
        return this.http.post(`boxen/${deviceId}/credentials`, { user_id: userId, ...credentials });
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
     * Create multiple Subracks at once
     * @param deviceId Id of the Device to create Subracks for
     * @param subracks Array of Subrack objects to add
     */
    public createSubracks(deviceId: number, subracks: { name: string; description: string }[]): Observable<any> {
        return this.http.post<any>(`boxen/${deviceId}/subracks`, subracks);
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
     * Get list of Management Cards inside specific Subrack of a Device
     * @param deviceId Id of the Device which holds the Cards
     * @param subrackId Id of the Subrack which holds the Cards
     */
    public getManagementCards(deviceId: number | string, subrackId: number | string): Observable<{ id: number }[]> {
        return this.http
            .get<{ count: number; members: { id: number }[] }>(`boxen/${deviceId}/mgmt_cards`, {
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
    public getCard(deviceId: number, cardId: number): Observable<Card> {
        return this.http.get<Card>(`boxen/${deviceId}/cards/${cardId}`);
    }

    /**
     * Get a Management Card by its Id
     * @param deviceId Id of the Device which holds the Card
     * @param cardId Id of the Card to get
     */
    public getManagementCard(deviceId: number, cardId: number): Observable<Card> {
        return this.http.get<Card>(`boxen/${deviceId}/mgmt_cards/${cardId}`);
    }

    /**
     * Create multiple Cards at once
     * @param deviceId Id of the parent Device
     * @param subrackId Id of the Subrack the Cards will be added to
     * @param cards Array of Cards to add
     */
    public createCards(deviceId: number, subrackId: number, cards: any[]): Observable<any> {
        return this.http.post<any>(`boxen/${deviceId}/cards`, cards);
    }

    /**
     * Create multiple Cards at once
     * @param deviceId Id of the parent Device
     * @param subrackId Id of the Subrack the Cards will be added to
     * @param cards Array of Management Cards to add
     */
    public createManagementCards(deviceId: number, subrackId: number, cards: any[]): Observable<any> {
        return this.http.post<any>(`boxen/${deviceId}/mgmt_cards`, cards);
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
     * Get a list of all Management Ports of a Card
     * @param deviceId Id of the Device which holds the Card
     * @param cardId Id of the Card to get Ports for
     */
    public getManagementPorts(deviceId: number | string, cardId: number | string): Observable<{ id: number }[]> {
        return this.http
            .get<{ count: number; members: { id: number }[] }>(`boxen/${deviceId}/mgmt_ports`, {
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
     * Get a Management Port by its Id
     * @param deviceId Id of the Device which contains the Port
     * @param portId Id of the Port to get
     */
    public getManagementPort(deviceId: number | string, portId: number | string): Observable<Port> {
        return this.http.get<Port>(`boxen/${deviceId}/mgmt_ports/${portId}`);
    }

    /**
     * Create multiple Ports at once
     * @param deviceId Id of the parent Device
     * @param cardId Id of the Card to add the Ports to
     * @param ports Array of Ports to create
     */
    public createPorts(deviceId: number, cardId: number, ports: any[]): Observable<any> {
        return this.http.post<any>(`boxen/${deviceId}/ports`, ports);
    }

    /**
     * Create multiple Management Ports at once
     * @param deviceId Id of the parent Device
     * @param cardId Id of the Card to add the Ports to
     * @param ports Array of Ports to create
     */
    public createManagementPorts(deviceId: number, cardId: number, ports: any[]): Observable<any> {
        return this.http.post<any>(`boxen/${deviceId}/mgmt_ports`, ports);
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
     * Create multiple ONTs at once
     * @param deviceId Id of the parent Device
     * @param portId Id of the Port to add the ONTs to
     * @param onts Array of ONTs to create
     */
    public createOnts(deviceId: number, portdId: number, onts: any[]): Observable<any> {
        return this.http.post<any>(`boxen/${deviceId}/onts`, onts);
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
     * Create multiple ONT Ports at once
     * @param deviceId Id of the parent Device
     * @param ontId Id of the ONT to add the ONT Ports to
     * @param ontPorts Array of ONT Ports to create
     */
    public createOntPorts(deviceId: number, ontId: number, ontPorts: any[]): Observable<any> {
        return this.http.post<any>(`boxen/${deviceId}/ont_ports`, ontPorts);
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
     * Create multiple CPEs at once
     * @param deviceId Id of the parent Device
     * @param ontPortId Id of the ONT Port to add the CPEs to
     * @param cpes Array of CPEs to create
     */
    public createCpes(deviceId: number, ontPortId: number, cpes: any[]): Observable<any> {
        return this.http.post<any>(`boxen/${deviceId}/cpes`, cpes);
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
     * Create multiple CPE Ports at once
     * @param deviceId Id of the parent Device
     * @param cpeId Id of the CPE to add the CPE Ports to
     * @param cpePorts Array of CPE Ports to create
     */
    public createCpePorts(deviceId: number, cpeId: number, cpePorts: any[]): Observable<any> {
        return this.http.post<any>(`boxen/${deviceId}/cpe_ports`, cpePorts);
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

    /**
     * Update properties of a given Object
     * @param deviceId Id of the Device containing the Object subject to the edit
     * @param objectType Type of the Object to edit, see possible options below
     * @param objectId Id of the Object to edit
     * @param properties Object containining properties and their values subject to edit
     */
    public updateObjectProperty(
        deviceId: number,
        objectType:
            | "subracks"
            | "cards"
            | "ports"
            | "onts"
            | "ont_ports"
            | "cpes"
            | "cpe_ports"
            | "vlans"
            | "vlan_connections"
            | "port_profiles"
            | "port_profile_connections",
        objectId: number,
        properties: { [key: string]: any },
    ): Observable<any> {
        return this.http.put<any>(`boxen/${deviceId}/${objectType}/${objectId}`, properties).pipe(delay(1000));
    }

    /**
     * Checks if a Device has an open Terminal session
     * @param deviceId Id of the Device to check
     */
    public hasOpenSession(deviceId: number): boolean {
        return this.terminalSessions.some((session) => session.deviceId === deviceId);
    }

    /**
     * Clones/duplicates a Device by its Id
     * @param deviceId Id of the Device to clone
     */
    public cloneDevice(deviceId: number): Observable<Device> {
        return this.http.put<Device>(`boxen/${deviceId}/clone`, {});
    }

    /**
     * Deletes a Device by its Id
     * @param deviceId Id of the Device to delete
     */
    public deleteDevice(deviceId: number): Observable<any> {
        return this.http.delete<any>(`boxen/${deviceId}`);
    }

    /**
     * Gets a list of available vendors including their device models and versions
     */
    public getVendors(): Observable<Vendors> {
        return this.http.get<Vendors>("vendors");
    }
}
