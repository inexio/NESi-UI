import { Directive, Input, ElementRef, HostListener, OnInit } from "@angular/core";

@Directive({
    selector: "[appHidePassword]",
})
export class HidePasswordDirective implements OnInit {
    // Password
    private password: string;

    constructor(private element: ElementRef) {}

    ngOnInit(): void {
        // Store password
        this.password = this.element.nativeElement.innerText;

        // Hide password
        this.element.nativeElement.innerText = "*".repeat(this.password.length);
    }

    // Show password on mouseenter
    @HostListener("mouseenter") onMouseEnter(): void {
        this.element.nativeElement.innerText = this.password;
    }

    // Hide password on mouseleave
    @HostListener("mouseleave") onMouseLeave(): void {
        this.element.nativeElement.innerText = "*".repeat(this.password.length);
    }
}
