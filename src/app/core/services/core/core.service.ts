import { Injectable, ElementRef } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class CoreService {
    /**
     * Element Reference to the wrapper element of the Devices page(s)
     */
    public devicesContentWrapper: ElementRef;

    /**
     * Boolean if any Http Request is currently pending
     */
    public requestPending: boolean = false;

    constructor() {}
}
