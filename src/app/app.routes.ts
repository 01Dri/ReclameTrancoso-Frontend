import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { ComplaintComponent } from './components/complaint/complaint.component';
import { CreateComplaintComponent } from './components/create-complaint/create-complaint.component';

export const routes: Routes = [

    {path: '', redirectTo: '/login', pathMatch: 'full' },
    {path: 'login', component: LoginPageComponent},
    {path: 'register', component: RegisterPageComponent},
    {path: 'complaint', component: CreateComplaintComponent, canActivate: [authGuard]},
    {path: 'home', component: HomeComponent, canActivate: [authGuard]},
    {path: 'complaint-details', component: ComplaintComponent, canActivate: [authGuard]},

];
