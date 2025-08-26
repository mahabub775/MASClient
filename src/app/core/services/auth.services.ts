import { Injectable } from '@angular/core';
import {JwtHelperService} from'@auth0/angular-jwt'
import {  CanActivate , Router} from '@angular/router';
import{IdleService} from '../../services/idle.service'
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

//import { NavmainmenuComponent } from '../admin/chayapath/navmainmenu/navmainmenu.component';
@Injectable()
export class AuthService implements CanActivate {

 // constructor() { }
readonly rootURI =  'https://localhost:7164/api';   //Local
//readonly rootURI =  'http://192.168.3.89:426/api';  //Live

 oLoggedInUser:any;
  constructor( private  Router :Router,  public  jwthelper  :JwtHelperService,  private http: HttpClient , private idleService: IdleService ) 
  { 
  }



canActivate(): boolean {
    const token = localStorage.getItem("jwt");
    
    if (token && !this.jwthelper.isTokenExpired(token)) {
      this.idleService.startWatching(); // restart on each page guard
      return true;
    } else {
      this.idleService.logout(); // ensures cleanup
      return false;
    }
  }

  CurstomHeader(){
    var t = localStorage.getItem("jwt");
    var headers_object = new HttpHeaders({  'Content-Type': 'application/json',  'Authorization': "Bearer "+t  });
    
    return  headers_object
  }
  
  GetuserLoginInfo(){
    this.oLoggedInUser= localStorage.getItem("logininfo");
     return this.oLoggedInUser?  JSON.parse(this.oLoggedInUser):null;
  }
   GetLoginuserDbId(){
    this.oLoggedInUser= localStorage.getItem("logininfo");
     return this.oLoggedInUser?  JSON.parse(this.oLoggedInUser).user.id:null;
  }
// //#region  Login
LogIn(userId :any, password :any) {
  let obj = { userName: userId, password: password };
  return this.http.post(this.rootURI+"/Auth/Login", obj, { observe: 'response' })
}
LogOut() {
  return this.http.get(this.rootURI+"/Auth/Logout", { observe: 'response' });
}

}
