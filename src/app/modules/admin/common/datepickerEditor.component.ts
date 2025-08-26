import { Component, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import moment from 'moment';
 // Use moment.js for formatting

@Component({
  selector: 'app-datepicker-editor',
  template: `
    <nz-date-picker 
      #datePicker 
      [(ngModel)]="dateValue" 
      (ngModelChange)="onDateChanged($event)" 
      (blur)="onBlur()"
      [nzFormat]="'dd-MMM-yyyy'"
      style="width: 100%;">
    </nz-date-picker>
  `
})
export class DatepickerEditorComponent implements ICellEditorAngularComp {
  private params: any;
  public dateValue: any;

  @ViewChild('datePicker', { static: true }) datePicker!: NzDatePickerComponent;

  agInit(params: any): void {
    this.params = params;
    this.dateValue = params.value ? new Date(params.value) : new Date();
  }

  getValue(): any {
    return this.dateValue ? moment(this.dateValue).format('DD MMM YYYY') : '';
  }

  onDateChanged(event: Date) {
    this.dateValue = event;
    
    // ✅ Update grid column immediately after selection
    this.params.api.stopEditing();
  }

  onBlur(): void {
    this.params.api.stopEditing();
  }

  afterGuiAttached(): void {
    setTimeout(() => this.datePicker.open()); // Open date picker properly
  }
}
