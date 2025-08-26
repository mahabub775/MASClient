import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserregistrationComponent } from './userregistration.component';
import {AuthService} from '../../core/services/auth.services'
import { UserComponent } from './user.component';
import { AdminlayoutComponent } from './adminlayout.component';
import { ChangePasswordComponent } from './change-password.component';

import { DeshboardModule } from './deshboard/deshboard.module';
import { DeshboardComponent } from './deshboard/deshboard/deshboard.component';
import { AppointmentsComponent } from './transaction/Appointment/Appointments/Appointments.component';

const routes: Routes = [
  {  path: '', component: DeshboardComponent},
  
  { path: 'trans',  loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule), canActivate:[AuthService] },
  {  path: 'users', component: UsersComponent,  canActivate:[AuthService] },  
  {  path: 'user/:id', component: UserComponent,  canActivate:[AuthService]},
  {  path: 'userreg', component: UserregistrationComponent,  canActivate:[AuthService] },
  { path: 'changepass', component: ChangePasswordComponent , canActivate:[AuthService] },
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
