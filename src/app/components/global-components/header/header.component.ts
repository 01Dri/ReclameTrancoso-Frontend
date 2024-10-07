import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(

    private cookieService: CookieService,
    private localStorageService: LocalStorageService,
    private router: Router
  ){}


  public logout() {
    this.cookieService.deleteAll();
    this.localStorageService.clear();
    this.router.navigateByUrl("/login");
  }

}
