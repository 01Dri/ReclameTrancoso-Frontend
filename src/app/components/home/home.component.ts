import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RequestService } from '../../services/request.service';
import { PagedResponseDto } from '../../models/PagedResponseDto';
import { ComplaintDTO } from '../../models/ComplaintDTO';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ComplaintStatus } from '../../enums/ComplaintStatus';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, MatCardModule, MatPaginatorModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private residentId!: number;
  public pagedResponseDto: PagedResponseDto<ComplaintDTO> = new PagedResponseDto<ComplaintDTO>();
  public pageSize: number = 5;
  public pageNumber: number = 1;
  public complaintStatus = ComplaintStatus; 

  constructor(
    private requestService: RequestService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.residentId = Number(this.cookieService.get("residentId"));
    this.loadComplaints(this.pageNumber, this.pageSize);
  }

  loadComplaints(page: number, size: number): void {
    this.requestService.get<PagedResponseDto<ComplaintDTO>>(`v1/complaints/${this.residentId}?page=${page}&size=${size}`)
    .subscribe({
      next: (data) => {
        this.pagedResponseDto = data;
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
}
