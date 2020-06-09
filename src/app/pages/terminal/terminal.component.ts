import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-terminal",
    templateUrl: "./terminal.component.html",
    styleUrls: ["./terminal.component.css"],
})
export class TerminalComponent implements OnInit {
    public availableCommands: { command: string; description: string }[] = [
        {
            command: "show operational-data line <port_identifier> detail",
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

    public filteredCommands: { command: string; description: string }[] = [];

    public searchTerm: string;

    constructor() {}

    ngOnInit(): void {
        this.filteredCommands = this.availableCommands;
    }

    public filter(searchTerm: string): void {
        console.log(searchTerm);
        this.filteredCommands = this.availableCommands.filter((command) => {
            return (
                command.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
                command.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }
}
