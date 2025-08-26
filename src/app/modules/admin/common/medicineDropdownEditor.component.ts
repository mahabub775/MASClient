import { Component } from '@angular/core';
import { ICellEditorComp, ICellEditorParams } from 'ag-grid-community';

interface MedicineEditorParams extends ICellEditorParams {
  getMedicines: () => any[]; // Custom function to fetch Medicines
}

@Component({
  selector: 'app-Medicine-dropdown-editor',
  template: `
    <nz-select [(ngModel)]="selectedMedicine" style="width: 100%;" [nzShowSearch]="true" (ngModelChange)="onValueChange($event)">
      <nz-option *ngFor="let Medicine of Medicines" [nzValue]="Medicine.id" [nzLabel]="Medicine.name"></nz-option>
    </nz-select>
  `,
})
export class MedicineDropdownEditorComponent implements ICellEditorComp {
  Medicines: any[] = [];
  selectedMedicine: any;
  params!: MedicineEditorParams; // Use extended interface

  agInit(params: MedicineEditorParams): void {
    this.params = params;
    if (params.getMedicines) {
      this.Medicines = params.getMedicines(); // Fetch Medicine list dynamically
    }
    this.selectedMedicine = params.value; // Set initial value
  }

  getValue(): any {
   // debugger;
    return this.selectedMedicine; // Return selected Medicine ID
  }


onValueChange(value: any) {
    debugger;
    this.selectedMedicine = value; // Update selected value
    const selectedMedicine: any = this.Medicines.find((p: any) => parseInt(p.id) === parseInt(value));
  
    if (selectedMedicine) {
      // Update MedicineName column
      this.params.node.setDataValue("medicineName", selectedMedicine.name);
  
      // Update medicinId column
      this.params.node.setDataValue("medicinId", selectedMedicine.id);
    }
  
    // Stop editing so that grid updates
    this.params.api.stopEditing();
  }
  

  afterGuiAttached?(): void {}

  isPopup(): boolean {
    return false; // Not a popup editor
  }

  getGui(): HTMLElement {
    return document.createElement('div'); // Placeholder for Ag-Grid
  }
}
