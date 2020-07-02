import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { Vendors } from "../../../core/interfaces/vendors.interface";

import Achorn from "achorn";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { Router } from "@angular/router";
const achorn = new Achorn();

@Component({
    selector: "app-create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.css"],
})
export class CreateComponent implements OnInit {
    /**
     * Store vendors object to access models and versions
     */
    public vendors: Vendors;

    /**
     * Returns a list of vendors
     */
    public get vendorNames(): string[] {
        return this.vendors ? Object.keys(this.vendors) : [];
    }

    /**
     * Returns a list of models for given vendor
     * @param vendor Name of the vendor to get available models for
     */
    public getModelsForVendor(vendor: string): string[] {
        return Object.keys(this.vendors[vendor]);
    }

    /**
     * Reeturns a list of versions of given model by given vendor
     * @param vendor Name of the vendor
     * @param model Name of the model to get versions for
     */
    public getVersionsForModel(vendor: string, model: string): string[] {
        return this.vendors[vendor][model];
    }

    /**
     * Device Form value bindings
     */
    public deviceForm: {
        vendor: string;
        model: string;
        version: string;
        description: string;
        hostname: string;
    } = {
        vendor: "",
        model: "",
        version: "",
        description: "",
        hostname: "",
    };

    constructor(public api: ApiService, private router: Router) {}

    /**
     * Request status of Device creation request
     */
    public createDeviceState: RequestState = "idle";

    ngOnInit(): void {
        this.api.getVendors().subscribe({
            next: (vendors) => {
                this.vendors = vendors;
            },
            error: (error) => {
                //@ts-ignore
                achorn.error(error);
            },
        });
    }

    /**
     * Create new device with specified information
     */
    public createDevice(): void {
        this.api.createDevice(this.deviceForm).subscribe({
            next: (device) => {
                this.createDeviceState = "success";
                this.router.navigate(["/devices", device.id]);
            },
            error: (err) => {
                this.createDeviceState = "error";
            },
        });
    }
}
