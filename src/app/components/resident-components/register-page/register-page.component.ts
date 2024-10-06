import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../../services/request/request.service';
import { ResidentRegisterRequestDTO } from '../../../models/ResidentRegisterRequestDTO';
import { ResidentRegisterResponseDTO } from '../../../models/ResidentRegisterResponseDTO';
import { BuildingResponseDTO } from '../../../models/BuildingResponseDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CpfMaskDirective } from '../../../diretives/cpf-mask.directive';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CpfMaskDirective],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})

export class RegisterPageComponent implements OnInit {
  public apartments: number[] = [];
  public selectedBlock: number | null = null;
  public blocks: number[] = [];
  public confirmPasssword:string = ""; 
  public buildingResponseDTO =  new BuildingResponseDTO();
  public residentRegisterRequestDTO =  new ResidentRegisterRequestDTO();
  public residentRegisterResponseDTO = new  ResidentRegisterResponseDTO();
  public validationErrors: { [key: string]: string } = {};
  public isAlreadyRequest: boolean = false;

  constructor
  (
    private request: RequestService,
    private toastr: ToastrService,
    private router: Router

  ) {
  }

  ngOnInit(): void {
    this.getBuildings();
  }

  public register() {
    this.validatePassword();
    this.request.post<ResidentRegisterResponseDTO>(`v1/resident`, this.residentRegisterRequestDTO)
      .subscribe({
        next: (response: ResidentRegisterResponseDTO) => {
          this.isAlreadyRequest = true;
          this.residentRegisterResponseDTO = response;
          setTimeout(() => {
              this.router.navigateByUrl('/login');
          }, 900)
          this.toastr.success('Usuário criado com sucesso!', 'Sucesso');
          this.validationErrors = {};

        },
        error: (error: HttpErrorResponse) => {
          this.isAlreadyRequest = false;
          if (error.error && error.error.Errors) {
            this.validationErrors = {};
            error.error.Errors.forEach((err: any) => {
              this.validationErrors[err.Field] = err.Error;
            });
          } else {
            console.log("Detalhes do Erro:", error.error);
          }
        },
      });

  }

  private getBuildings() {
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

  public validatePassword() {
    if (this.residentRegisterRequestDTO.password !== this.confirmPasssword) {
      this.validationErrors["PasswordConfirmation"] = "Senhas não se correspondem";
    }  else {
      this.validationErrors["PasswordConfirmation"] = "";
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
}
