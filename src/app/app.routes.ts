import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { ComplaintPageComponent } from './components/complaint-page/complaint-page.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [

    {path: '', redirectTo: '/login', pathMatch: 'full' },
    {path: 'login', component: LoginPageComponent},
    {path: 'register', component: RegisterPageComponent},
    {path: 'complaint', component: ComplaintPageComponent, canActivate: [authGuard]},
    {path: 'home', component: HomeComponent, canActivate: [authGuard]},

];
