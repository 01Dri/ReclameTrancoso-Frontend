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
import { ComplaintUpdateRequestDTO } from '../../models/ComplaintUpdateRequestDTO';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private router: Router, private cookieService: CookieService, private requestService: RequestService, private toastr: ToastrService) {
    this.residentId = Number(this.cookieService.get("residentId"));
    this.getResidentInformations();
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['complaint']) {
      this.complaint = navigation.extras.state['complaint'] as ComplaintDTO;
    }


  }

  public saveChanges() {
    console.log('Salvando alterações:', this.complaint);
    this.requestService.put<ComplaintDTO>(`v1/complaints/${this.complaint.id}`, new ComplaintUpdateRequestDTO(
      this.complaint.id, 
      this.complaint.title,
      this.complaint.description,
      this.complaint.complaintType,
      this.complaint.additionalInformation1,
      this.complaint.additionalInformation2,
      this.complaint.additionalInformation3,
      this.complaint.isAnonymous,
      this.complaint.status)).
      
      subscribe ({
        next: (data: ComplaintDTO) => {
          this.complaint = data;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          error.error.Errors.forEach((err: any) => {
            this.toastr.error(err.Error, "Ocorreu um erro!")
          });
        },
        complete: () => {
          this.router.navigateByUrl("/home");
        }
      });
  }

  public cancelChanges() {
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
