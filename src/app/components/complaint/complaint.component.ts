import { Component } from '@angular/core';
import { ComplaintDTO } from '../../models/ComplaintDTO';
import { Router } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ResidentResponseDTO } from '../../models/ResidentResponseDTO';
import { RequestService } from '../../services/request.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent {
  public complaint!: ComplaintDTO;
  public residentId!: number;
  public residentResponseDTO: ResidentResponseDTO = new ResidentResponseDTO();

  constructor(private router: Router, private cookieService: CookieService, private requestService: RequestService) {
    this.residentId = Number(this.cookieService.get("residentId"));
    this.getResidentInformations();
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['complaint']) {
      this.complaint = navigation.extras.state['complaint'] as ComplaintDTO;
    }


  }

  saveChanges() {
    // Lógica para salvar as mudanças (chamada de serviço)
    console.log('Salvando alterações:', this.complaint);
  }

  cancelChanges() {
    // Lógica para cancelar as mudanças (pode redirecionar para outra página ou recarregar os dados)
    console.log('Alterações canceladas.');
    this.router.navigateByUrl('/');
  }

  public getResidentInformations() {
    if (this.residentId) {
      this.requestService.get<ResidentResponseDTO>(`v1/resident/${this.residentId}`)
      .subscribe({
        next: (response) => {
          this.residentResponseDTO = response;
          console.log(JSON.stringify(this.residentResponseDTO))
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
        }
      })
    }
  }
}
