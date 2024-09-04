import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConstantValues } from '../../utils/constants';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  apartments: number[] = [];
  selectedBlock: number | null = null;
  maxBlocks: number;
  blocks: number[] = [];

  constructor() {
    this.maxBlocks = ConstantValues.MAX_BUILDS;
    this.blocks = Array.from({ length: this.maxBlocks }, (_, i) => i + 1);
  }

  public onBlockSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const block = target.value ? parseInt(target.value, 10) : null;
    this.selectedBlock = block;
    if (block !== null) {
      const startApartment = 5 * (block - 1) + 1;
      const endApartment = 5 * block;
      this.apartments = Array.from({ length: 5 }, (_, i) => startApartment + i);
    }
  }
}
