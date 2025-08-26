import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import {AuthService} from "../core/services/auth.services"
import { Observable, catchError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  httpOptions  =<any> "";
  private rootURI = ''; private controllerName = 'appointment';
   constructor(private http: HttpClient, private AuthService:AuthService) { 
     this.rootURI = AuthService.rootURI;
     this.httpOptions = { headers:this.AuthService.CurstomHeader() };
   }

  Get( Id:any) {
    //debugger;
    return this.http.get(this.rootURI+`/`+this.controllerName +`/Get?id=${Id}`, this.httpOptions);
  }


GetWithPIDetail( Id:any) {
  //debugger;
  return this.http.get(this.rootURI+`/`+this.controllerName +`/GetWithPIDetail?id=${Id}`, this.httpOptions);
}
  
  GetsWithPagination(pageNumber:number, patientordoctor:string) {
  //  debugger;
   const encodedpatientordoctor= encodeURIComponent(patientordoctor);
  const url = `${this.rootURI}/${this.controllerName}/GetAppointments?pageNumber=${pageNumber}&patientordoctor=${encodedpatientordoctor}`;
  return this.http.get(url, this.httpOptions);
  
  }


  GetMedicalDatas() {
     
    const url = `${this.rootURI}/${this.controllerName}/GetMedicalDatas`;
    return this.http.get(url, this.httpOptions);
  }
  Delete(Id: any) {
    return this.http.delete(this.rootURI+`/`+this.controllerName +`/Delete?id=${Id}`,  this.httpOptions);
  }
  DeleteDetail(Id: any) {
    return this.http.delete(this.rootURI+`/`+this.controllerName +`/DeleteDetail?id=${Id}`,  this.httpOptions);
  }
  
  Create(obj: any): Observable<any> {
    return this.http.post<any>(this.rootURI+`/`+this.controllerName+`/Create`, obj, this.httpOptions);  
  }
  
  Update(obj: any): Observable<any>  {

    return this.http.put(this.rootURI+`/`+this.controllerName +`/Update`,  obj,  this.httpOptions);
  }


}
