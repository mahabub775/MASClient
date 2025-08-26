import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-delete-button-renderer',
  //<button      type="button"  nz-button nzType="primary"    class="btn edit-btn px-2 py-.5 bg-cyan-500 text-white rounded-md"(click)="onEditClick()"> Edit </button>  
  template: `
    
    <button      type="button" nz-button  nzType="default"    class="btn btn-danger px-2 py-.5 bg-red-500 text-white rounded-md"(click)="onDeleteClick()"> Delete </button>  
    `,
})
export class AppointmentButtonRendererComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  onDeleteClick() {
   // debugger;
    this.params.context.componentParent.onDeleteClick(this.params?.data); // Call parent method
  }

}
