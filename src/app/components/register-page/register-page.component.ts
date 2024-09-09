import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConstantValues } from '../../utils/constants';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { ResidentRegisterRequestDTO } from '../../models/ResidentRegisterRequestDTO';
import { ResidentRegisterResponseDTO } from '../../models/ResidentRegisterResponseDTO';
import { BuildingDTO } from '../../models/BuildingDTO';
import { BuildingResponseDTO } from '../../models/BuildingResponseDTO';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  apartments: number[] = [];
  selectedBlock: number | null = null;
  maxBlocks!: number;
  blocks: number[] = [];

  public buildingResponseDTO =  new BuildingResponseDTO();
  public residentRegisterRequestDTO =  new ResidentRegisterRequestDTO();
  public residentRegisterResponseDTO = new  ResidentRegisterResponseDTO();

  constructor
  (
    private request: RequestService

  ) {
  }

  ngOnInit(): void {
    this.getBuildings();
  }

  public register() {
    this.request.post<ResidentRegisterResponseDTO>(`${ConstantValues.ROUTE_V1}/residents`, this.residentRegisterRequestDTO)
      .subscribe({
        next: (response: ResidentRegisterResponseDTO) => {
          this.residentRegisterResponseDTO = response;
        },
        error: (error) => {
          console.log("ERRO " + error);
        }
      });
  }

  public getBuildings() {
    this.request.get<BuildingResponseDTO>(`v1/buildings`)
    .subscribe({
      next: (response: BuildingResponseDTO) => {
        this.buildingResponseDTO = response
      },
      error: (error) => {
        console.log("ERROR: " + JSON.parse(error))
      }, 
      complete: () => {
        this.blocks = Array.from({ length: this.buildingResponseDTO.buildings.length}, (_, i) => i + 1);
      }
    });
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
