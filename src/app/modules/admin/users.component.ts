import { Component } from '@angular/core';
import { User } from '../../models/User';
import {AuthService} from '../../core/services/auth.services';
import {UserService} from '../../services/user.service';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from '@angular/router';
import { MenuStateService } from '../../services/menu-state.service';


@Component({
  selector: 'app-users',
  template: `
  <button nz-button   (click)="NewUser()" nzType="primary">New</button>
    <br/>
  <nz-table #basicTable [nzData]="listOfData">
  <thead>
    <tr>
      <th>Name</th>
      <th>Login Id</th>
      <th>Email</th>
      <th>Phone Number</th>
      <th>Address</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let data of basicTable.data">
      <td>{{ data.name }}</td>
      <td>{{ data.username }}</td>
      <td>{{ data.email }}</td>
      <td>{{ data.phoneNumber }}</td>
      <td>{{ data.address }}</td>
      <td>
        <a (click)="Edit(data.userId)">Edit</a>&nbsp;&nbsp;&nbsp;
        <a nz-popconfirm nzPopconfirmTitle="Sure to delete?" (nzOnConfirm)="deleteRow(data.userId)">Delete</a>
      </td>
    </tr>
  </tbody>
</nz-table>

  `,
  styles: ``
})
export class UsersComponent {


  httpOptions  =<any> "";
  listOfData: User[] = [
    { userId : 'asd45452s5d', name: 'abdiu',  username: 'abdulla', email:'mahabub775@d',phoneNumber: '1254664744', address: 'New York No. 1 Lake Park' , roleNames:[]}
   ];

  constructor( private _httpclient:HttpClient, private router: Router, private Auth:  AuthService,  private menuStateService: MenuStateService, private UserService:  UserService,private ar: ActivatedRoute ){
    this.httpOptions = { headers:this.Auth.CurstomHeader() };
    this.onGridReady();
  }

  onGridReady() {

    this.UserService.Gets().subscribe(
      ( data: any) => {
        this.listOfData = data;
      },
      error => {
        console.error('Error fetching resources:', error);
      }
    );

      
    }

  
  

  NewUser(){  

    this.router.navigateByUrl('admin/userreg');
        // Update the menu state in the shared service
     //   this.menuStateService.updateMenuState(`${'users'}`, 'Admin');
    console.log(this.router.url);
    
    
  }

  deleteRow(userId:string) :void  {
    this.UserService.Delete(userId).subscribe(
      () => {
        this.listOfData = this.listOfData.filter(d => d.userId !== userId);
      },
      error => {
        console.error('Error deleting user:', error);
      }
    );
  }

  Edit(userId:string){
    this.router.navigate(['admin/user',userId]);
  }

}
