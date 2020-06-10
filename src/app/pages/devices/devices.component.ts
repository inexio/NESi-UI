import { Component, OnInit, ViewChild, TemplateRef, ElementRef, AfterViewChecked, AfterViewInit } from "@angular/core";
import { ApiService } from "../../core/services/api/api.service";
import { CoreService } from "../../core/services/core/core.service";

@Component({
    selector: "app-devices",
    templateUrl: "./devices.component.html",
    styleUrls: ["./devices.component.css"],
})
export class DevicesComponent implements OnInit, AfterViewInit {
    constructor(public api: ApiService, private core: CoreService) {}

    @ViewChild("contentWrapper") contentWrapper: ElementRef;

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.core.devicesContentWrapper = this.contentWrapper;
    }
}
