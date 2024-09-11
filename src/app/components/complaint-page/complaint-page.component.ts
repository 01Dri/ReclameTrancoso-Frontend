import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-complaint-page',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './complaint-page.component.html',
  styleUrl: './complaint-page.component.css'
})
export class ComplaintPageComponent {

}
