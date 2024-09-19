import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { TokenResponseDTO } from '../models/TokenResponseDTO';
import { RefreshTokenRequestDTO } from '../models/RefreshTokenRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = 'https://localhost:44345/api/';
  private headers = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private cookie: CookieService) { }

  private getHeaders(): HttpHeaders {
    const token = this.localStorageService.get('accessToken');
    this.headers = new HttpHeaders();
    if (token) {
      this.headers = this.headers.set('Authorization', `Bearer ${token}`);
    }
    return this.headers;
  }

  get<T>(endpoint: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.get<T>(this.apiUrl + endpoint, { headers }).pipe(
      catchError(this.handleError.bind(this)) // Handle errors here
    );
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http.post<T>(this.apiUrl + endpoint, body, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http.put<T>(this.apiUrl + endpoint, body, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http.patch<T>(this.apiUrl + endpoint, body, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.delete<T>(this.apiUrl + endpoint, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  refreshToken(): Observable<TokenResponseDTO> {
    const refreshToken = this.localStorageService.get("refreshToken");
    return this.http.post<TokenResponseDTO>("https://localhost:44345/api/v1/auth/refresh-token", new RefreshTokenRequestDTO(refreshToken)).pipe(
      switchMap((data: TokenResponseDTO) => {
        this.localStorageService.set('accessToken', data.accessToken);
        this.headers = this.headers.set('Authorization', `Bearer ${data.accessToken}`);
        return this.http.get<TokenResponseDTO>("https://localhost:44345/api/");
      }),
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401 || error.status === 403) {
      return this.refreshToken().pipe(
        switchMap(() => {
          return throwError(() => error);
        }),
        catchError(err => throwError(() => err))
      );
    }
    return throwError(() => error);
  }
}
