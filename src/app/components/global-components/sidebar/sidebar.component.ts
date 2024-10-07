import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ManagerService } from '../../../services/manager/manager.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    CommonModule
  ],

  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  public isExpanded: boolean = false;


  constructor(private router: Router, private managerService: ManagerService) {
  }


  public toggleSidebar(expanded: boolean) {
    this.isExpanded = expanded;
  }

  public toHome() {
    if (this.managerService.isManager()) {
      console.log("É MANAGER ISSO")
      this.router.navigateByUrl("/manager-home");
      return;
    }
    this.router.navigateByUrl("/home");
  }

  public toComplaintTicket() {
    if (!this.managerService.isManager()) {
      this.router.navigateByUrl("/create-complaint-ticket");
      return;
    }
  }


}
