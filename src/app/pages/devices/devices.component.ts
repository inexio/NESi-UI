import { Component, OnInit, ViewChild, TemplateRef, ElementRef, AfterViewChecked, AfterViewInit } from "@angular/core";
import { ApiService } from "../../core/services/api/api.service";
import { CoreService } from "../../core/services/core/core.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-devices",
    templateUrl: "./devices.component.html",
    styleUrls: ["./devices.component.css"],
})
export class DevicesComponent implements OnInit, AfterViewInit {
    constructor(public api: ApiService, private core: CoreService, private router: Router) {}

    @ViewChild("contentWrapper") contentWrapper: ElementRef;

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.core.devicesContentWrapper = this.contentWrapper;
    }

    public openTerminal(deviceId: number): void {
        setTimeout(() => {
            this.router.navigate(["/devices", deviceId, "terminal"]);
        }, 10);
    }
}
