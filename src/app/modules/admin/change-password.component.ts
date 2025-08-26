import { Component } from '@angular/core';
import {AuthService} from '../../core/services/auth.services';
import {CommonService} from '../../services/common.services';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  template: `
  
  <form nz-form nzLayout="vertical" (ngSubmit)="changePassword()">
  <nz-form-item>
    <nz-form-label [nzSpan]="8" nzRequired>Current Password</nz-form-label>
    <nz-form-control [nzSpan]="16">
      <input nz-input type="password" name="currentPassword" [(ngModel)]="currentPassword" required />
    </nz-form-control>
  </nz-form-item>
  <nz-form-item>
    <nz-form-label [nzSpan]="8" nzRequired>New Password</nz-form-label>
    <nz-form-control [nzSpan]="16">
      <input nz-input type="password" name="newPassword" [(ngModel)]="newPassword" required />
    </nz-form-control>
  </nz-form-item>
  <nz-form-item>
    <nz-form-label [nzSpan]="8" nzRequired>Confirm New Password</nz-form-label>
    <nz-form-control [nzSpan]="16">
      <input nz-input type="password" name="confirmPassword" [(ngModel)]="confirmPassword" required />
    </nz-form-control>
  </nz-form-item>
  <nz-form-item>
    <nz-form-control [nzOffset]="8" [nzSpan]="6">
      <button nz-button nzType="primary" nzBlock type="submit">Change Password</button>
    </nz-form-control>
  </nz-form-item>
</form>
  `,
  styles: ``
})
export class ChangePasswordComponent {
  currentPassword: string = "";
  newPassword: string= "";
  confirmPassword: string= "";
  httpOptions  =<any> ""; 
  constructor(private Auth: AuthService, private _httpclient:HttpClient,  private location: Location, private commonService:CommonService) {
    this.httpOptions = { headers:this.Auth.CurstomHeader() };
    
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.commonService.ErrorMessage('New password and confirm password must match');
      return;
    }
    if(this.Auth.GetuserLoginInfo()==null) {
      this.commonService.ErrorMessage('Invalid Logged In user');
      return;  
    }
    //this.Auth.GetuserLoginInfo().user.name:"";
    this._httpclient.put<any>(this.Auth.rootURI +'/user/ChangePassword', {userId: this.Auth.GetuserLoginInfo().user.id, currentPassword: this.currentPassword,newPassword: this.newPassword},  this.httpOptions).subscribe(data => {
  debugger;
      console.log(data);
      this.commonService.SaveMessage(`Password changed successfully`);
      this.location.back();
  // Handle success
  
});


  //   this.authService.changePassword(this.currentPassword, this.newPassword)
  //     .subscribe(
  //       () => {
  //         this.commonService.SaveMessage('Password changed successfully');
  //       },
  //       (error) => {
  //         this.commonService.ErrorMessage(error.message || 'Failed to change password');
  //       }
  //     );
  // }
}
}