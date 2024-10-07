import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RequestService } from '../../../services/request/request.service';
import { FormsModule } from '@angular/forms';
import { LoginRequestDTO } from '../../../models/LoginRequestDTO';
import { TokenResponseDTO } from '../../../models/TokenResponseDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CpfMaskDirective } from '../../../diretives/cpf-mask.directive';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { TokenService } from '../../../services/token/token.service';
import { CookieService } from 'ngx-cookie-service';
import { MatSpinner } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, CpfMaskDirective, MatSpinner],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent  implements OnInit{

  public logintype: string = "";
  public loginRequestDto: LoginRequestDTO = new LoginRequestDTO();
  private tokenResponseDTO: TokenResponseDTO = new TokenResponseDTO();
  public validationErrors: { [key: string]: string } = {};
  public isLoading: boolean = false;

  constructor(
    private router: Router,
    private request: RequestService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService ,
    private tokenService: TokenService,
    private cookieService: CookieService

  ){}

  ngOnInit(): void {
    if (this.tokenService.isLogged()) {
      console.log("TA LOGADO")
      this.router.navigateByUrl("/home");
    } else {
      console.log("NÃO ESTÁ LOGADO");
    }
  }


  public navigateToRegister() {
    this.router.navigate(['/register']);
  }

  public login() {
    this.isLoading = true;
    if (this.logintype === "CPF") {
      this.loginRequestDto.email = "";
    } else {
      this.loginRequestDto.cpf = "";

    }
    this.request.post<TokenResponseDTO>(`v1/auth`, this.loginRequestDto)
    .subscribe({
      next: (response: TokenResponseDTO) => {
        this.tokenResponseDTO  = response;
        this.toastr.success('Login efetuado com sucesso!', 'Sucesso');
        this.validationErrors = {};
        this.localStorageService.set("accessToken", this.tokenResponseDTO.accessToken);
        this.localStorageService.set("refreshToken", this.tokenResponseDTO.refreshToken);

        this.localStorageService.set("accessTokenExpiresAt", String(this.tokenResponseDTO.accessTokenExpiresAt));
        this.localStorageService.set("refreshTokenExpiresAt", String(this.tokenResponseDTO.accessTokenExpiresAt));


        if (this.tokenResponseDTO.entityId.isManager === false) {
          this.cookieService.set("residentId", this.tokenResponseDTO.entityId.entityId.toString());
        } else {
          this.cookieService.set("managerId", this.tokenResponseDTO.entityId.entityId.toString());
        }
        this.cookieService.set("isManager", (String(this.tokenResponseDTO.entityId.isManager)));

        if (this.tokenResponseDTO.entityId.isManager) {
          this.router.navigateByUrl("/manager-home")
          console.log("MANAGER HOME")
          return;

        } else {
          console.log("HOME ")
          this.router.navigateByUrl("/home")
          return;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error('Ocorreu um erro!', 'Erro');
        if (error.error['error']){
          this.validationErrors["Password"] = error.error['error']
        }

        if (error.error && error.error.Errors) {
          console.log(error)
          this.validationErrors = {};
          error.error.Errors.forEach((err: any) => {
            this.validationErrors[err.Field] = err.Error;
          });
        } else {
          console.log("Detalhes do Erro:", error.error);
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });

  }


}

