import { Directive, ElementRef, HostListener, OnChanges, SimpleChanges } from "@angular/core";

@Directive({
    selector: "[appPlaceholderWidth]",
})
export class PlaceholderWidthDirective {
    constructor(private element: ElementRef) {}

    ngAfterViewInit(): void {
        this.element.nativeElement.setAttribute("size", this.element.nativeElement.getAttribute("placeholder").length);
    }

    @HostListener("ngModelChange") ngOnChanges(): void {
        if (this.element.nativeElement.value.length === 0) {
            this.element.nativeElement.setAttribute("size", this.element.nativeElement.getAttribute("placeholder").length);
        } else {
            this.element.nativeElement.setAttribute("size", this.element.nativeElement.value.length);
        }
    }
}
