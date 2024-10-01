import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  public isLogged(): boolean {
    console.log(this.localStorageService.getAll())
    const accessToken = this.localStorageService.get("accessToken");
    const refreshToken = this.localStorageService.get("refreshToken");
    const accessTokenExpiresAt = new Date(this.localStorageService.get("accessTokenExpiresAt"));
    const refreshTokenExpiresAt = new Date(this.localStorageService.get("refreshTokenExpiresAt"));

    if (!accessToken || !refreshToken || !accessTokenExpiresAt || !refreshTokenExpiresAt) {
      return false;
    }
    return true;
  }
}
