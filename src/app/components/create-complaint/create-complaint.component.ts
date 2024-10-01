import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { RequestService } from '../../services/request/request.service';
import { CookieService } from 'ngx-cookie-service';
import { ResidentRegisterResponseDTO } from '../../models/ResidentRegisterResponseDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ComplaintCreateRequestDTO } from '../../models/ComplaintCreateRequestDTO';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { ComplaintType } from '../../enums/ComplaintType';
import { CommonModule } from '@angular/common';
import { BuildingResponseDTO } from '../../models/BuildingResponseDTO';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-complaint-page',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, MatButtonModule, MatIconModule, MatToolbarModule, FormsModule, MatInputModule, MatFormFieldModule, MatCardModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './create-complaint.component.html',
  styleUrl: './create-complaint.component.css'
})
export class CreateComplaintComponent implements OnInit {

  public residentResponseDTO: ResidentRegisterResponseDTO = new ResidentRegisterResponseDTO();
  public createComplaintDTO: ComplaintCreateRequestDTO = new ComplaintCreateRequestDTO();
  public residentId!: number;
  public complaintTypes = ComplaintType; 
  public selectedBlock: number | null = null;
  public blocks: number[] = [];
  public apartments: number[] = [];
  public buildingResponseDTO =  new BuildingResponseDTO();
  public isBlockDisabled = true;
  public isApartmentDisabled = true;
  public validationErrors: { [key: string]: string } = {};
  public isLoading = false;

  constructor
  (
    private requestService: RequestService,
    private cookieService: CookieService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toastr: ToastrService

  ) {}
public ngOnInit(): void {
  this.getBuildings();
  this.residentId = Number(this.cookieService.get("residentId"));
  if (!this.residentId) {
    this.localStorageService.clear()
    this.router.navigateByUrl("/login");
  }

  this.getResidentInformations();
}

public createComplaint() {
  console.log(this.createComplaintDTO.complaintType)
  this.createComplaintDTO.residentId = this.residentId;
  if (this.createComplaintDTO.complaintType === null || this.createComplaintDTO.complaintType === undefined) {
    console.log("TIPO NULO")
    this.validationErrors["ComplaintType"] = "Tipo da reclamação é obrigatória.";
    return;
  }
  console.log(JSON.stringify(this.createComplaintDTO))
  if (this.createComplaintDTO.complaintType == this.complaintTypes.APARTMENT) {
    this.createComplaintDTO.additionalInformation1  = "Bloco " + this.createComplaintDTO.additionalInformation1;
    this.createComplaintDTO.additionalInformation2  = "Apartamento " + this.createComplaintDTO.additionalInformation2;
  }

  this.createComplaintDTO.complaintType = Number(this.createComplaintDTO.complaintType);
  this.isLoading = true;
  this.requestService.post(`v1/complaints`, this.createComplaintDTO)
  .subscribe({
    next: () => {
      console.log("RECLAMAÇÃO CADASTRADA.")
      this.validationErrors = {};
      this.toastr.success('Ticket enviado!', 'Sucesso');
      this.clearForm();
      this.getBuildings();

    },
    error: (error: HttpErrorResponse) => {
      console.log(JSON.stringify(this.createComplaintDTO))
      console.log(JSON.stringify(error.error.Errors))
      if (error.error && error.error.Errors) {
        this.validationErrors = {};
        error.error.Errors.forEach((err: any) => {
          console.log(err.Field)
          this.validationErrors[err.Field] = err.Error;
        });
        console.log(this.validationErrors)
        this.isLoading = false;

      } else {
        console.log("Detalhes do Erro:", error.error);
        this.isLoading = false;

      }
    },
    complete: () => {
      this.isLoading = false;
      console.log("STATUS LOADING: " + this.isLoading)
    }
  })
}
public getResidentInformations() {
  if (this.residentId) {
    this.requestService.get<ResidentRegisterResponseDTO>(`v1/resident/${this.residentId}`)
    .subscribe({
      next: (response) => {
        this.residentResponseDTO = response;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error)
      }
    })
  }
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

private getBuildings() {
  this.requestService.get<BuildingResponseDTO>(`v1/buildings`)
  .subscribe({
    next: (response: BuildingResponseDTO) => {
      this.buildingResponseDTO = response
    },
    error: (error) => {
      if (error.error && error.error.Errors) {
        this.validationErrors = {};
        error.error.Errors.forEach((err: any) => {
          this.validationErrors[err.Field] = err.Error;
        });
      } else {
        console.log("Detalhes do Erro:", error.error);
      }
    }, 
    complete: () => {
      this.blocks = Array.from({ length: this.buildingResponseDTO.buildings.length}, (_, i) => i + 1);
    }
  });
}

public onComplaintTypeChange(): void {
  console.log(this.createComplaintDTO.complaintType);
  if (Number(this.createComplaintDTO.complaintType) === Number(this.complaintTypes.APARTMENT)) {
    this.isBlockDisabled = false;
    this.isApartmentDisabled = false;
    return;
  }

  this.isBlockDisabled = true;
  this.isApartmentDisabled = true;
  this.createComplaintDTO.additionalInformation1 = '';
  this.createComplaintDTO.additionalInformation2 = '';
}

public clearForm() {
  this.createComplaintDTO = new ComplaintCreateRequestDTO();
  this.blocks = [];
  this.apartments = [];
  this.selectedBlock = null;
  this.validationErrors = {};
  this.isBlockDisabled = true;
  this.isApartmentDisabled = true;
}

}
