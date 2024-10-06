import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  public manager: boolean = false;

  constructor(private cookieService: CookieService)  {
    var isManagerValueFromCookie = this.cookieService.get("isManager");
    if (isManagerValueFromCookie !== undefined || isManagerValueFromCookie !== null) {
      this.manager = isManagerValueFromCookie === "true";
    }
   }

   public isManager(): boolean {
    return this.manager;
   }
}
