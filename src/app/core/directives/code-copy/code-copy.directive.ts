import { Directive, ElementRef, HostListener } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";

@Directive({
    selector: "[appCodeCopy]",
})
export class CodeCopyDirective {
    constructor(private element: ElementRef, private message: NzMessageService) {
        this.element.nativeElement.style.cursor = "pointer";
        this.element.nativeElement.style.userSelect = "none";
    }

    @HostListener("mouseenter") onMouseEnter(): void {
        this.element.nativeElement.style.backgroundColor = "#177ddc";
    }

    @HostListener("mouseleave") onMouseLeave(): void {
        this.element.nativeElement.style.backgroundColor = null;
    }

    @HostListener("mousedown") onClick(): void {
        this.copyToClipboard(this.element.nativeElement.textContent);
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
