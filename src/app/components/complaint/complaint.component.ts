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
import { ManagerAddCommentRequestDTO } from '../../models/ManagerAddCommentRequestDTO';
import { CommentDTO } from '../../models/CommentDTO';

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
  public isManager!: boolean;
  public isManagerCookieValue!: string;

  public managerId!: number;


  constructor(private router: Router, private cookieService: CookieService, private requestService: RequestService, private toastr: ToastrService) {

    this.residentId = Number(this.cookieService.get("residentId"));
    this.isManagerCookieValue = this.cookieService.get("isManager");
    this.isManager = this.isManagerCookieValue === "true";

    console.log(this.residentId);
    console.log("IS MANAGER? " + this.isManager)
    if (this.isManager) {
      this.managerId = Number(this.cookieService.get("managerId"));
      
    }
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['complaint']) {
      this.complaint = navigation.extras.state['complaint'] as ComplaintDTO;
      if (this.complaint.managerComment.id === null || this.complaint.managerComment.text === null) {
          this.complaint.managerComment = new CommentDTO();
      }
      if (this.residentId === 0 || this.residentId === null) {
        this.residentId = this.complaint.residentId;
        console.log(this.residentId);
      }
    }
    this.getResidentInformations();

  }

  public saveChanges() {
    console.log('Salvando alterações:', this.complaint);
    if (this.isManager) {
      if (this.isManager && this.complaint.managerComment !== null) {
        const commentDTO = new CommentDTO();
        commentDTO.id = this.complaint.managerComment.id;
        commentDTO.text = this.complaint.managerComment.text;

        this.requestService.post("v1/manager/add-comment", new ManagerAddCommentRequestDTO(this.managerId, this.complaint.id, commentDTO))
        .subscribe({
          next: () => {
            this.toastr.success("Ticket atualizado com sucesso!", "Sucesso!")
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
            error.error.Errors.forEach((err: any) => {
            this.toastr.error(err.Error, "Ocorreu um erro!")
      });
          },
          complete: () => {
            this.router.navigateByUrl("/manager-home");
          }
        })
      } else {
        this.router.navigateByUrl("/home");
      }
    } else {

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
