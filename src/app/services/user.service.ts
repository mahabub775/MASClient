import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {AuthService} from "../core/services/auth.services"
import { User } from '../models/User';
import { Observable, catchError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions  =<any> "";
 private rootURI = ''; private controllerName = 'user';
  constructor(private http: HttpClient, private AuthService:AuthService) { 
    this.rootURI = AuthService.rootURI;
    this.httpOptions = { headers:this.AuthService.CurstomHeader() };
  }


//#region  
Gets() {
  
  return this.http.get<User[]>(this.rootURI+`/`+this.controllerName +`/Gets`, this.httpOptions);
}



Get( Id:any) {
  //debugger;
  return this.http.get(this.rootURI+`/`+this.controllerName +`/Get?Userid=${Id}`, this.httpOptions);
}
Delete(Id: any) {
  return this.http.delete(this.rootURI+`/`+this.controllerName +`/Delete?Userid=${Id}`,  this.httpOptions);
}
//
Registration(obj: any): Observable<any> {
  return this.http.post<any>(this.rootURI+`/`+this.controllerName+`/Registration`, obj, this.httpOptions);
  
}

 
Updateuser(obj: any): Observable<any>  {
  return this.http.put(this.rootURI+`/`+this.controllerName +`/UpdateUser`,  obj,  this.httpOptions);
}

//#endregion
}
