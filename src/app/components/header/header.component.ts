import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { CookieService } from 'ngx-cookie-service';
import { ResidentRegisterResponseDTO } from '../../models/ResidentRegisterResponseDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { BuildingDTO } from '../../models/BuildingDTO';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

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
