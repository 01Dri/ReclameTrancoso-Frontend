import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../global-components/sidebar/sidebar.component";
import { RequestService } from '../../../services/request/request.service';
import { PagedResponseDto } from '../../../models/PagedResponseDto';
import { ComplaintDTO } from '../../../models/ComplaintDTO';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ComplaintStatus } from '../../../enums/ComplaintStatus';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, MatCardModule, MatPaginatorModule, CommonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private residentId!: number;
  public pagedResponseDto: PagedResponseDto<ComplaintDTO> = new PagedResponseDto<ComplaintDTO>();
  public complaintHandled:ComplaintDTO[] = [];
  public complaintNotHandled:ComplaintDTO[] = [];

  public pageSize: number = 10;
  public pageNumber: number = 1;
  public complaintStatus = ComplaintStatus; 

  public selectedComplaint: ComplaintDTO | null = null; // Reclamação selecionada para expandir


  constructor(
    private requestService: RequestService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.residentId = Number(this.cookieService.get("residentId"));
    this.loadComplaints(this.pageNumber, this.pageSize);
  }

  public loadComplaints(page: number, size: number): void {
    this.requestService.get<PagedResponseDto<ComplaintDTO>>(`v1/complaints/${this.residentId}?page=${page}&size=${size}`)
    .subscribe({
      next: (data) => {
        this.pagedResponseDto = data;
        this.complaintHandled = this.pagedResponseDto.data.filter(v => Number(v.status) === Number(this.complaintStatus.TREATED));
        this.complaintNotHandled = this.pagedResponseDto.data.filter(v => Number(v.status) === Number(this.complaintStatus.NO_TREATMENT));

      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching complaints:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadComplaints(this.pageNumber, this.pageSize);
  }

  public removeComplaint(id: number) {

    console.log(`Remover reclamação com ID: ${id}`);
    this.requestService.delete(`v1/complaints/${id}`)
    .subscribe({
      next: () => {
        console.log("Complaint removida: " + id)
      },
      error: (error: HttpErrorResponse) => {
        console.log(error)
        console.log("STATUS ERRO: " + error.status)
      },
      complete: () => {
        this.loadComplaints(5, 5);
      }
    });
  }

  public expandComplaint(complaint: ComplaintDTO) {
    this.selectedComplaint = complaint;
    console.log(`Expandir reclamação com ID: ${complaint.id}`);
    this.router.navigateByUrl('/complaint-details', { state: { complaint: this.selectedComplaint } });

  }
}
