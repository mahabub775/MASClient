import { Component } from '@angular/core';
import {JwtHelperService} from'@auth0/angular-jwt'
import{IdleService} from '../services/idle.service'
import { Router } from '@angular/router';
import * as  jwt_decode from 'jwt-decode'; 
@Component({
  selector: 'app-loginlayout',
  templateUrl: './loginlayout.component.html',
  styles: ``
})
export class LoginlayoutComponent {
  public IsLoggedIn = false;
  constructor(private _router: Router, private jwthelper:JwtHelperService, private idleService: IdleService) {
  //  debugger;
    this.IsLoggedIn = this.checkIsAuthnticated();

  }

  
  checkIsAuthnticated(){
    var token = localStorage.getItem("jwt");
    if(token!=null && token!="" && token!="undefined")
      {
     //debugger;
      let tokenPayload:any = jwt_decode.jwtDecode(token); // Decode the token
      const expirationDate = new Date(tokenPayload.exp * 1000); // Convert expiration time to milliseconds

      // Check if token is expired
      if (expirationDate <= new Date()) 
      {

        return false; // Prevent activating the route
      }
     
      return true;
    }else{
      return false;
    }
  }

  AfterLogin(res:any)
  {
    debugger;
    if(res=="sucess")
    {
      this.IsLoggedIn=true;
      this.idleService.startWatching();
      this._router.navigateByUrl('/admin');
     }
  }
}
