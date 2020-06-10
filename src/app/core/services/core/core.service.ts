import { Injectable, ElementRef } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class CoreService {
    public devicesContentWrapper: ElementRef;

    constructor() {}
}
