import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../core/services/api/api.service";
import { RequestState } from "../../core/interfaces/request-state.type";
import { Device } from "../../core/interfaces/device.interface";

@Component({
    selector: "app-devices",
    templateUrl: "./devices.component.html",
    styleUrls: ["./devices.component.css"],
})
export class DevicesComponent implements OnInit {
    constructor(public api: ApiService) {}

    ngOnInit(): void {}
}
