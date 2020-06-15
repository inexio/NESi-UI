import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RequestState } from "../../../core/interfaces/request-state.type";
import * as moment from "moment";
import { ApiService } from "../../../core/services/api/api.service";
import { CoreService } from "../../../core/services/core/core.service";
import { Device } from "../../../core/interfaces/device.interface";
import { ActivatedRoute } from "@angular/router";
import { delay } from "rxjs/operators";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: "app-terminal",
    templateUrl: "./terminal.component.html",
    styleUrls: ["./terminal.component.css"],
})
export class TerminalComponent implements OnInit {
    /**
     * Terminal ElementRef to automatically scroll down on new responses
     */
    @ViewChild("terminalContentElement") private terminalContentElement: ElementRef;

    /**
     * Array of commands available in current layer
     */
    public availableCommands: { command: string; description: string }[] = [
        {
            command: "show operational-data line <port_identifier> detail <page_number>",
            description: "List current directory",
        },
        {
            command: "info configure line <port_identifier>",
            description: "Displays current system status",
        },
        {
            command: "show linkup-record <port_identifier> detail",
            description: "Terminate current session",
        },
        {
            command: "info configure line <port_identifier> detail",
            description: "Terminate current session",
        },
        {
            command: "show cpe-inventory <port_identifier> detail",
            description: "Terminate current session",
        },
        {
            command: "show equipment slot <card_identifier> detail",
            description: "Terminate current session",
        },
        {
            command: "show equipment shelf <subrack_identifier> detail",
            description: "Terminate current session",
        },
        {
            command: "show interface port <pon_port_identifiert> detail",
            description: "Terminate current session",
        },
        {
            command: "show interface port <ethernet_port_identifiert> detail",
            description: "Terminate current session",
        },
        {
            command: "show equipment diagnostics <port_identifier> detail",
            description: "Terminate current session",
        },
        {
            command: "show vlan bridge-port-fdb <port_identifier> detail",
            description: "Terminate current session",
        },
        {
            command: "info configure bridge port <port_identifier> detail",
            description: "Terminate current session",
        },
        {
            command: "show software-mngt version etsi detail",
            description: "Terminate current session",
        },
        {
            command: "show shdsl span-status <port_identifier> detail",
            description: "Terminate current session",
        },
        {
            command: "info configure ethernet ont <ont_port_identifier> detail",
            description: "Terminate current session",
        },
    ];

    /**
     * Array of filtered commands available in current layer
     */
    public filteredCommands: { command: string; description: string }[] = [];

    /**
     * Term commands are filtered for
     */
    public searchTerm: string;

    /**
     * Request status of terminal initiation
     */
    public terminalInit: RequestState = "idle";

    /**
     * Request status of commands
     */
    public commandRequest: RequestState = "idle";

    /**
     * String containing the terminal content
     */
    public terminalContent: { timestamp: string; body: string }[] = [];

    /**
     * Complete device information
     */
    public device: Device;

    constructor(private api: ApiService, public core: CoreService, private route: ActivatedRoute, private message: NzMessageService) {}

    public commandParts: { type: "part" | "value"; part: string; value: string }[] = [];

    ngOnInit(): void {
        // Reset filter
        this.filteredCommands = this.availableCommands;

        this.route.params.subscribe((params) => {
            // Init terminal session and send some example commands
            this.terminalInit = "pending";

            this.api
                .getDevice(params.id)
                .pipe(delay(1000))
                .subscribe({
                    next: (device) => {
                        this.device = device;
                        this.terminalInit = "success";

                        // Run example commands
                        this.runCommand("tox -e example-restcli");
                        setTimeout(() => {
                            this.runCommand("login");
                        }, 3000);
                    },
                    error: (error) => {
                        console.error(error);
                        this.terminalInit = "error";
                    },
                });
        });
    }

    public prepareCommand(command: string): void {
        this.commandParts = command.split(" ").map((part: string) => {
            const isPlaceholder = part.startsWith("<") && part.endsWith(">");
            return {
                type: isPlaceholder ? "value" : "part",
                part: isPlaceholder ? part.replace("<", "").replace(">", "") : part,
                value: isPlaceholder ? "" : part,
            };
        });
    }

    public getCommand(): string {
        return this.commandParts.map((part) => part.value).join(" ");
    }

    /**
     * Run given command inside terminal
     * @param command Command to run
     */
    public runCommand(command: string): void {
        this.commandRequest = "pending";

        // Scroll to botton of terminal when new line is added
        if (this.terminalContentElement) {
            this.terminalContentElement.nativeElement.scrollTop = this.terminalContentElement.nativeElement.scrollHeight;
        }

        this.api.runCommand(command).subscribe({
            next: (response) => {
                this.terminalContent.push({
                    timestamp: moment().format("HH:mm:ss"),
                    body: response,
                });

                // Scroll to botton of terminal when new line is added
                if (this.terminalContentElement) {
                    this.terminalContentElement.nativeElement.scrollTop = this.terminalContentElement.nativeElement.scrollHeight;
                }
            },
            complete: () => {
                this.commandRequest = "success";
            },
            error: (error) => {
                console.error(error);
                this.commandRequest = "error";
            },
        });
    }

    /**
     * Filter commands for given string
     * @param searchTerm Substring to filter command for
     */
    public filter(searchTerm: string): void {
        this.filteredCommands = this.availableCommands.filter((command) => {
            return (
                command.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
                command.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }

    /**
     * Copies given string to clipboard and shows success message
     * @param text String to copy to clipboard
     */
    public copyToClipboard(text: string): void {
        navigator.clipboard.writeText(text);
        this.message.success("Copied!");
    }
}
