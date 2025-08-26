import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from './transaction-routing.module';


import { AppointmentComponent } from './Appointment/Appointment/Appointment.component';
import { AppointmentButtonRendererComponent} from './Appointment/Appointment/appointmentButtonRenderer.component'

import { AppointmentsComponent } from './Appointment/Appointments/Appointments.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgZorroControlsdModule  } from '../../../ng.zorro.controls.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCardModule } from 'ng-zorro-antd/card';
import { AgGridAngular } from "ag-grid-angular";
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

import {  ClientSideRowModelModule,  ColDef,  ColGroupDef,  CsvExportModule,  ExcelExportParams,  GridApi,  GridOptions,  GridReadyEvent,  CellRendererSelectorResult,  ModuleRegistry,  NumberFilterModule,  TextFilterModule,  ValidationModule,  createGrid} from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";

import { AgGridModule } from 'ag-grid-angular';

ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ValidationModule,
  AllCommunityModule
]);

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Import specific icons
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { enableProdMode } from '@angular/core';
import { SendEmailComponent } from './send-email/send-email.component';



if ((window as any).ENABLE_PROD_MODE) {
  enableProdMode();
}

@NgModule({
  declarations: [

AppointmentComponent,
AppointmentsComponent,
AppointmentButtonRendererComponent,
SendEmailComponent,

  ],
  imports: [
    AgGridModule,
    CommonModule,
    TransactionRoutingModule,
    TransactionRoutingModule,
    NzDropDownModule,
    NzIconModule,
    NzButtonModule,
    NgZorroControlsdModule,
    NzCardModule,
    NzPaginationModule,
    AgGridAngular,
    NzGridModule,
    FontAwesomeModule ,
    NzDatePickerModule,
    NzRadioModule,
    
  ]
})
export class TransactionModule { }
