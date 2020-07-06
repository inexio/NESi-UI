import { Component, OnInit, Input } from "@angular/core";
import { ApiService } from "../../services/api/api.service";
import { RequestState } from "../../interfaces/request-state.type";
import { Ont } from "../../interfaces/ont.interface";
import { ActivatedRoute } from "@angular/router";

import Achorn from "achorn";
import { NzModalService } from "ng-zorro-antd/modal";
import { PortCreateComponent } from "../port-create/port-create.component";
import { OntPortCreateComponent } from "../ont-port-create/ont-port-create.component";
const achorn = new Achorn();

@Component({
    selector: "app-ont-visual",
    templateUrl: "./ont-visual.component.html",
    styleUrls: ["./ont-visual.component.css"],
})
export class OntVisualComponent implements OnInit {
    /**
     * Id of the parent device used for routing and requesting Ont data
     */
    public parentDeviceId: number;

    /**
     * Port object, either given as input or retrieved through the API
     */
    @Input("ont") public ont?: Ont;
    @Input("ontId") public ontId?: number;

    /**
     * Request state of the Ont if it has to be retrieved through the API
     */
    public ontRequest: RequestState = "idle";

    /**
     * Array of parsed ports to display
     */
    public ports: any[] = [];

    constructor(private route: ActivatedRoute, private api: ApiService, private modal: NzModalService) {}

    ngOnInit(): void {
        // Get id of parent device from route
        this.route.params.subscribe((params) => {
            this.parentDeviceId = params.id;

            // Get Ont if none is given
            if (!this.ont) {
                // Throw error if either parentDeviceId or subrackId are missing
                if (!this.parentDeviceId || !this.ontId) {
                    throw new Error("Missing `parentDeviceId` or `ontId` which are needed to request Ont data");
                }
            } else {
                this.parsePorts();
            }
        });
    }

    /**
     * Get ONT data
     */
    public getOnt(): void {
        // Get Ont data
        this.ontRequest = "pending";
        this.api.getOnt(this.parentDeviceId, this.ont.id || this.ontId).subscribe({
            next: (ont) => {
                this.ont = ont;
                this.parsePorts();
                this.ontRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.ontRequest = "error";
            },
        });
    }

    /**
     * Parse card ports into array of port pairs to display them
     */
    public parsePorts(): void {
        this.ports = [];
        for (let i = 0; i < Number(this.ont.ppc || 8); i++) {
            this.ports.push(this.ont.ont_ports[i] ? this.ont.ont_ports[i] : { id: null, operational_state: null });
        }
    }

    /**
     * Open a Modal where the User can create new ONT Ports
     */
    public openCreateOntPortsModal() {
        const modal = this.modal.create({
            nzTitle: "Create ONT Ports",
            nzContent: OntPortCreateComponent,
            nzComponentParams: {
                parentDeviceId: this.parentDeviceId,
                ont: this.ont,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh Subrack data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getOnt();
        });
    }
}
