import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Vlan } from "../../../core/interfaces/Vlan.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { Profile } from "../../../core/interfaces/profile.interface";

@Component({
    selector: "app-port-profile",
    templateUrl: "./port-profile.component.html",
    styleUrls: ["./port-profile.component.css"],
})
export class PortProfileComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
    ) {}

    /**
     * Port Profile data and Port Profile data request
     */
    public profile: { [key: string]: any };
    public profileRequest: RequestState = "idle";

    /**
     * Port Profile Connections and Port Profile Connections request
     */
    public profileConnections: { id: string }[];
    public profileConnectionsRequest: RequestState = "idle";

    /**
     * Array of Port Profiles attributes to display
     */
    public attributes: { key: string; value: string }[] = [];

    /**
     * Id of the parent device
     */
    public parentDeviceId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.parentDeviceId = params.id;

            /**
             * Get Port Profile data
             */
            this.profileRequest = "pending";
            this.api.getPortProfile(params.id, params.portProfile).subscribe({
                next: (profile) => {
                    this.profile = profile;

                    /**
                     * Iterate over Vlan Connection arguments and parse them into array
                     */
                    Object.keys(profile).map((key) => {
                        if (["_links", "box", "box_id", "id"].includes(key)) return;
                        this.attributes.push({
                            key,
                            value: profile[key],
                        });
                    });

                    this.profileRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.profileRequest = "error";
                },
            });

            this.profileConnectionsRequest = "pending";
            this.api.getPortProfileConnections(params.id).subscribe({
                next: (profileConnections) => {
                    this.profileConnections = profileConnections;
                    this.profileConnectionsRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.profileConnectionsRequest = "error";
                },
            });
        });
    }

    /**
     * Event handler called when affix state changes
     * @param value Boolean if affix is affixed
     */
    public affixEvent(value: boolean) {
        this.isAffixed = value;
        this.zone.run(() => {});
    }

    /**
     * Method used to navigate one layer up
     */
    public navigateUp(): void {
        this.router.navigate(["/devices", this.parentDeviceId]);
    }
}
