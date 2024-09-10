import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCpfMask]',
  standalone: true
})
export class CpfMaskDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    }
    if (value.length > 6) {
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (value.length > 9) {
      value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }
    
    input.value = value;
  }

}
