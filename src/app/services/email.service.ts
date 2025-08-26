import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from "../core/services/auth.services"

@Injectable({
  providedIn: 'root'
})
export class EmailService {

        private rootURI = '';
  private controllerName = 'email';

  constructor(private http: HttpClient, private AuthService: AuthService) { 
    this.rootURI = this.AuthService.rootURI;
  }

  sendEmail(formData: FormData): Observable<any> {
    // ⚠️ do not send JSON headers here, let Angular handle multipart
    return this.http.post<any>(
      `${this.rootURI}/${this.controllerName}/SendEmail`,
      formData
    );  
  }
}
