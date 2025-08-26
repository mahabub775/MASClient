import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './Appointment/Appointments/Appointments.component';
import { SendEmailComponent } from './send-email/send-email.component';

import { AppointmentComponent } from './Appointment/Appointment/Appointment.component';
import {AuthService} from '../../../core/services/auth.services'





const routes: Routes = [
    {path: 'appointments', component: AppointmentsComponent, canActivate:[AuthService]},
    {path: 'appointments/:id/:mode', component: AppointmentComponent,  canActivate:[AuthService]},
    {path: 'email', component: SendEmailComponent, canActivate:[AuthService]},
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
