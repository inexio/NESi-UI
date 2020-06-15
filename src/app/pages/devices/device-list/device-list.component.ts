import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-device-list",
    templateUrl: "./device-list.component.html",
    styleUrls: ["./device-list.component.css"],
})
export class DeviceListComponent implements OnInit {
    constructor(public api: ApiService, public router: Router) {}

    ngOnInit(): void {}
}
