import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import {AuthService} from './core/services/auth.services';
import { HttpClient } from "@angular/common/http";
import { CommonService } from './services/common.services';

@Component({
  selector: 'app-login',
  template: ` <div fxLayout="row" fxLayoutAlign="center center" style="height:100vh;">
  <form nz-form [formGroup]="validateForm" class="login-form" (ngSubmit)="submitForm()">
  <div fxLayoutAlign="center center">
  <h2 nz-typography> Login </h2>
  </div>
  <nz-spin [nzSpinning]="isLoading">
  </nz-spin>
  <nz-form-item>
    <nz-form-control nzErrorTip="Please input your username!">
      <nz-input-group nzPrefixIcon="user">
        <input type="text" nz-input formControlName="userName" placeholder="Username" />
      </nz-input-group>
    </nz-form-control>
  </nz-form-item>
  <nz-form-item>
    <nz-form-control nzErrorTip="Please input your Password, minimum 3 !">
      <nz-input-group nzPrefixIcon="lock">
        <input type="password" nz-input formControlName="password"  minlength="3" placeholder="Password" />
      </nz-input-group>
    </nz-form-control>
  </nz-form-item>
  <div nz-row class="login-form-margin">
    <div nz-col [nzSpan]="12">
      <label nz-checkbox formControlName="remember">
        <span>Remember me</span>
      </label>
    </div>
    <div nz-col [nzSpan]="12">
      <a class="login-form-forgot">Forgot password</a>
    </div>
  </div>
  <button nz-button class="login-form-button login-form-margin" [nzType]="'primary'">Log in</button>
  
</form>
</div>

  `,
  styles: [
    `
    .login-form {
      max-width: 300px;
    }

    .login-form-margin {
      margin-bottom: 16px;
      
    }

    .login-form-forgot {
      float: right;
    }

    .login-form-button {
      width: 100%;
    }
    `
  ]
})
export class LoginComponent implements OnInit {

  
  @Output() public LoginResult = new EventEmitter();
  validateForm:  FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }>;

  isLoading: boolean = false;
  UserName=""; Password = ""; Message = "";  
   
  constructor(private fb: NonNullableFormBuilder,  private _httpclient:HttpClient, private Authservice:  AuthService,  private CommonService: CommonService, ) {
    //this.UserName="Admin"; this.Password ="123"; 
    // this.validateForm= this.fb.group({
    //   userName: ['admin', [Validators.required]],
    //   password: ['123', [Validators.required]],
    //   remember: [true]
    // });

    this.validateForm= this.fb.group({
      userName: ['admin', [Validators.required]],
      password: ['123', [Validators.required]],
      remember: [true]
    });

    this.Message = "";
   
   }
  
  ngOnInit(): void {
   // this.Login();//Temporary open it will be close after
  }

  submitForm(): void {
    if (this.validateForm.valid) 
    {

      this.isLoading = true;
      this.Authservice.LogIn(this.validateForm.value.userName, this.validateForm.value.password)
      .subscribe(o => {
        console.log(o);
          if (o.ok==true) {
            var oReturnobj = <any>o.body;
            const token = oReturnobj.token;
            localStorage.setItem('jwt',token);
            debugger;
            let logininfo =   { user: oReturnobj.user, userRoles : oReturnobj.userRoles};
            //console.log(oReturnobj.user.id);
            localStorage.setItem('logininfo',JSON.stringify(logininfo));
            this.isLoading = false;
            this.LoginResult.emit("sucess");
          } else {
            this.CommonService.ErrorMessage (`User or password mismatch`);
            this.LoginResult.emit("fail");
            this.isLoading = false;
          }
      }, o => {
        this.CommonService.ErrorMessage (`User or password mismatch`);
        this.LoginResult.emit("fail");
        this.isLoading = false;
      })



 
    }
  }


}
