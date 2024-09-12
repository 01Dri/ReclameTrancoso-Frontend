import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { RequestService } from '../../services/request.service';
import { CookieService } from 'ngx-cookie-service';
import { ResidentRegisterResponseDTO } from '../../models/ResidentRegisterResponseDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-complaint-page',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, MatButtonModule, MatIconModule, MatToolbarModule, FormsModule, MatInputModule, MatFormFieldModule, MatCardModule],
  templateUrl: './complaint-page.component.html',
  styleUrl: './complaint-page.component.css'
})
export class ComplaintPageComponent implements OnInit {

  public residentResponseDTO: ResidentRegisterResponseDTO = new ResidentRegisterResponseDTO();

  constructor
  (
    private requestService: RequestService,
    private cookieService: CookieService

  ) {}
public ngOnInit(): void {
  this.getResidentInformations();
}
public getResidentInformations() {
  const residentId = this.cookieService.get("residentId");
  if (residentId) {
    this.requestService.get<ResidentRegisterResponseDTO>(`v1/resident/${residentId}`)
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

}
