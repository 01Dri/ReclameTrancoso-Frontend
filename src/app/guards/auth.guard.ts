import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { RequestService } from '../services/request/request.service';
import { TokenResponseDTO } from '../models/TokenResponseDTO';
import { RefreshTokenRequestDTO } from '../models/RefreshTokenRequestDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of, from } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const requestService = inject(RequestService);
  const router = inject(Router);


  const accessToken = localStorageService.get("accessToken");
  const refreshToken = localStorageService.get("refreshToken");
  const accessTokenExpiresAt = new Date(localStorageService.get("accessTokenExpiresAt"));
  const refreshTokenExpiresAt = new Date(localStorageService.get("refreshTokenExpiresAt"));

  if (!accessToken || !refreshToken || !accessTokenExpiresAt || !refreshTokenExpiresAt) {
    return of(false);
  }

  if (accessTokenExpiresAt.getDay() < new Date().getDay() && refreshTokenExpiresAt.getDay() >= new Date().getDay()) {
    return from(requestService.post<TokenResponseDTO>("v1/auth", new RefreshTokenRequestDTO(refreshToken))).pipe(
      switchMap(response => {
        localStorageService.set("accessToken", response.accessToken);
        localStorageService.set("refreshToken", response.refreshToken);
        localStorageService.set("accessTokenExpiresAt", String(response.accessTokenExpiresAt));
        localStorageService.set("refreshTokenExpiresAt", String(response.refreshTokenExpiresAt));
        return of(true);
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        router.navigateByUrl("/login");
        return of(false);
      })
    );
  }
  return of(accessTokenExpiresAt.getDay() >= new Date().getDay());
};