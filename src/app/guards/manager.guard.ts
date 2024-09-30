import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const managerGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService);
  return Boolean(cookieService.get("isManager"));
};
