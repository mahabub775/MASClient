import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {AuthService} from "../core/services/auth.services"

import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportDataFetchService {
  httpOptions  =<any> "";
  private rootURI = ''; 
   constructor(private http: HttpClient, private AuthService:AuthService) { 
     this.rootURI = AuthService.rootURI;
     this.httpOptions = { headers:this.AuthService.CurstomHeader() };
   }

//#region  Purchase
  GetsPurchaseDataList(InvoiceNo :string,  supplierId:number, Specifications:string,  projectId:number,    ProductId:number, indentNo: string, mrrNo:string, startDate:string, endDate:string) {
   const encodedindentNo = encodeURIComponent(indentNo);
    const encodedmrrNo = encodeURIComponent(mrrNo);
   const encodedstartDate = encodeURIComponent(startDate);
   const encodedendDate = encodeURIComponent(endDate);
   const encodeSpecification = encodeURIComponent(Specifications);
   let controllerName = 'PurchaseInvoice';
    const url = `${this.rootURI}/${controllerName}/GetsPurchaseDataList?supplierId=${supplierId}&Specifications=${encodeSpecification}&projectId=${projectId}&InvoiceNo=${InvoiceNo}&IndentNo=${encodedindentNo}&ProductId=${ProductId}&mrrNo=${encodedmrrNo}&startDate=${encodedstartDate}&endDate=${encodedendDate}`;
    return this.http.get(url, this.httpOptions);
  }
  //#endregion


  //#region  waiting MRR
  GetIndentWaitforMrrs( purchaserId:number, Specifications:string,  projectId:number,    ProductId:number, indentNo: string,  startDate:string, endDate:string) {
   // debugger;
   const encodedindentNo = encodeURIComponent(indentNo);
   const encodedstartDate = encodeURIComponent(startDate);
   const encodedendDate = encodeURIComponent(endDate);
   const encodeSpecification = encodeURIComponent(Specifications);
   let controllerName = 'Indent';
    const url = `${this.rootURI}/${controllerName}/GetIndentWaitforMrrs?purchaserId=${purchaserId}&Specifications=${encodeSpecification}&projectId=${projectId}&IndentNo=${encodedindentNo}&ProductId=${ProductId}&startDate=${encodedstartDate}&endDate=${encodedendDate}`;
    return this.http.get(url, this.httpOptions);
  }
  //#endregion


  //#region  waiting Invoicew
  GetMrrWaitforInvoices( purchaserId:number, Specifications:string,  projectId:number,    ProductId:number, indentNo: string,mrrNo: string,  startDate:string, endDate:string) {
   // debugger;
   const encodedindentNo = encodeURIComponent(indentNo);
   const encodedmrrNo = encodeURIComponent(mrrNo);
   const encodedstartDate = encodeURIComponent(startDate);
   const encodedendDate = encodeURIComponent(endDate);
   const encodeSpecification = encodeURIComponent(Specifications);
   let controllerName = 'MRR';
    const url = `${this.rootURI}/${controllerName}/GetMrrWaitforInvoices?purchaserId=${purchaserId}&Specifications=${encodeSpecification}&projectId=${projectId}&IndentNo=${encodedindentNo}&MrrNo=${encodedmrrNo}&ProductId=${ProductId}&startDate=${encodedstartDate}&endDate=${encodedendDate}`;
    return this.http.get(url, this.httpOptions);
  }
  //#endregion

}

 