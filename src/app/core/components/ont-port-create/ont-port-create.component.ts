import { Component, OnInit } from "@angular/core";
import { RequestState } from "../../interfaces/request-state.type";
import { ApiService } from "../../services/api/api.service";
import { NzModalRef } from "ng-zorro-antd/modal";
import { Ont } from "../../interfaces/ont.interface";

@Component({
    selector: "app-ont-port-create",
    templateUrl: "./ont-port-create.component.html",
    styleUrls: ["./ont-port-create.component.css"],
})
export class OntPortCreateComponent {
    /**
     * Id of the parent Device holding the ONT Ports
     */
    public parentDeviceId: number;

    /**
     * Number of ONT Ports to add to current batch
     */
    public createCount: number = 1;

    /**
     * ONT object containing name, id, already existing ONT Ports
     */
    public ont: Ont;

    /**
     * Single ONT Port form
     */
    public ontPortForm: {
        description: string;
    } = {
        description: "",
    };

    /**
     * Returns the number of available ONT Ports
     */
    public get availablePorts(): number {
        return (this.ont.ppo || 8) - this.ont.ont_ports.length;
    }

    /**
     * ONT Port creation Request State
     */
    public createOntPortsRequest: RequestState = "idle";

    constructor(private api: ApiService, public modal: NzModalRef) {}

    /**
     * Http Request to create ONT Ports
     */
    public createOntPorts(): void {
        let ontPorts = [];
        for (let i = 0; i < this.createCount; i++) {
            ontPorts.push({
                description: this.ontPortForm.description,
                ont_id: this.ont.id,
            });
        }

        this.createOntPortsRequest = "pending";
        this.api.createOntPorts(this.parentDeviceId, this.ont.id, ontPorts).subscribe({
            next: () => {
                this.createOntPortsRequest = "success";
                this.modal.close();
            },
            error: () => {
                this.createOntPortsRequest = "pending";
            },
        });
    }
}
