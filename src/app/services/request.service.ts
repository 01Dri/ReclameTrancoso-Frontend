import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = 'https://localhost:44345/api/';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private cookie: CookieService) { }

  private getHeaders(): HttpHeaders {
    const token = this.localStorageService.get('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  get<T>(endpoint: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.get<T>(this.apiUrl + endpoint, { headers });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http.post<T>(this.apiUrl + endpoint, body, { headers });
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http.put<T>(this.apiUrl + endpoint, body, { headers });
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http.patch<T>(this.apiUrl + endpoint, body, { headers });
  }

  delete<T>(endpoint: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.delete<T>(this.apiUrl + endpoint, { headers });
  }
}
