import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import {CommonService} from '../../../../../services/common.services';
import { Location } from '@angular/common';
import {  NonNullableFormBuilder,    Validators} from '@angular/forms';
import { AppointmentService } from '../../../../../services/appointment.service';

import {AuthService} from '../../../../../core/services/auth.services';
import type { CellValueChangedEvent, ColDef,  GridApi,  GridReadyEvent, CellClickedEvent,   SelectionChangedEvent } from "ag-grid-community";

import { AGGridHelper } from '../../../../../core/AGGridHelper';
import { NzModalService } from 'ng-zorro-antd/modal';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AppointmentButtonRendererComponent } from './appointmentButtonRenderer.component';
import { DatepickerEditorComponent } from './../../../common/datepickerEditor.component';
import { MedicineDropdownEditorComponent } from './../../../common/medicineDropdownEditor.component';


@Component({
  selector: 'app-Appointment',
  templateUrl: './Appointment.component.html',
  styleUrls: ['./Appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  amountinWord:string = "-";
  AppointmentTypeList = this.CommonService

  Patients :any;
  Doctors:any;
  Medicines:any;
  
  AppointmentForm: any;
  PrescriptionDetailForm: any;

  private gridApi!: GridApi;
  public defaultColDef = AGGridHelper.DeafultCol;
    appointmentid:any;
    Appointment :  any;
    mode: string | null = null;
    fontName:any="";
    bIsEn:boolean = true;
    approvalName = "";
  isLoading: boolean = false;

public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  public value!: string;
  gridOptions = {
    context: { componentParent: this }, // Pass parent component context
  }
  AppointmentExists: boolean = false;
  detailmode = 'Add';
  @ViewChild('productNameInput') productNameInput: any;
  public rowDataDetail: any[] = [];
  constructor(private fb: NonNullableFormBuilder , private ar: ActivatedRoute , private router: Router, private nzmodal: NzModalService,  private Auth : AuthService,  private AppointmentService: AppointmentService, private CommonService: CommonService, private location : Location,private Appointmentservice: AppointmentService  ) {
   
   //debugger;  oReturnobj.user.id
    this.appointmentid =   this.ar.snapshot.paramMap.get('id');
   this.mode = this.ar.snapshot.paramMap.get('mode');
    this.LoadOthersControl();

  }

  ngOnInit(): void {
    console.log(this.Auth.GetuserLoginInfo().user.id);
    this.AppointmentForm = this.fb.group({
      id: [this.Appointment?.id || 0],    
      patientId: [this.Appointment?.patientId || 0, [Validators.required, Validators.min(1)]],
      doctorId: [this.Appointment?.doctorId || 0, [Validators.required, Validators.min(1)]],
      appointmentDate:[this.Appointment?.appointmentDate || new Date().toISOString().slice(0, 10)],  
      visitType: [this.Appointment?.visitType || true, [Validators.required]],
      diagnosis: [this.Appointment?.diagnosis || ""],
      note: [this.Appointment?.note || ""],
      createdBy: [this.Auth.GetLoginuserDbId()]
    });
  this.rowDataDetail = [];
  this.initializeDetailform(null);
  }

  initializeDetailform(detailobj : any){

    const databasestartDateDate = detailobj?.startDate || new Date().toISOString().slice(0, 10); // Example: '2025-01-20'
    const formattedstartDate = databasestartDateDate.split('T')[0]; // Extract only the date part

    const databaseEndDateDate = detailobj?.endDate || new Date().toISOString().slice(0, 10); // Example: '2025-01-20'
    const formattedEndDate = databaseEndDateDate.split('T')[0]; // Extract only the date part

    this.PrescriptionDetailForm = this.fb.group({
      id: [detailobj?.id ||0, [Validators.required]],
      appointmentId:[detailobj?.appointmentId || 0, [Validators.required]],

      medicinId: [detailobj?.medicinId || 0, [Validators.required , Validators.min(1)]],
      medicineName:[detailobj?.medicineName || ''],
      dosage:[detailobj?.dosage || ''],
      notes:[detailobj?.notes || ''],
      startDate:[formattedstartDate, [Validators.required]],
      startDateSt:[this.CommonService.MASdateformat(new Date(formattedstartDate)) || new Date().toISOString().slice(0, 10)],
      tempStartDate:[formattedstartDate],

      endDate:[formattedEndDate, [Validators.required]],
      endDateSt:[this.CommonService.MASdateformat(new Date(formattedEndDate)) || new Date().toISOString().slice(0, 10)],
      tempEndDate:[formattedEndDate]

    
     
    });
  }


  SaveDetail(){
    debugger;
     var oPrescriptionDetail = this.PrescriptionDetailForm.value;
     const existingRowData = [];
      this.gridApi.forEachNode((node) => existingRowData.push(node.data));
   
     this.rowDataDetail.push(oPrescriptionDetail);
      this.gridApi.applyTransaction({ add: [oPrescriptionDetail] });      

      this.gridApi.sizeColumnsToFit();
      this.initializeDetailform(null);

  }


  
  onDeleteClick(detailObj: any) 
  {
    debugger;
   // const rowIndex :any = this.gridApi.getSelectedNodes()[0]?.rowIndex;
    this.nzmodal.confirm({
      nzTitle: 'Are you sure want to delete this record?',
      nzOnOk: () => this.Delete(detailObj),
    });


  }
  

  
  Delete(detailObj:any) :void  {
    debugger;
    if (!detailObj) return;
    this.rowDataDetail = this.rowDataDetail.filter(row => row!== detailObj);
    this.gridApi.refreshCells({ force: true });
    
  }

  get AppointmentNo() {
    return this.AppointmentForm.get('AppointmentNo');
  }

  get f() {
    return this.AppointmentForm.controls;
  }

  onSubmit(): void {
//debugger;
    if (this.AppointmentForm.valid) 
      {
      this.gridApi.stopEditing();
      const oPrescriptionDetails :any = [];
      this.gridApi.forEachNode((node) => {
        const { Sl, ...rest } = node.data; // Destructure the node's data, excluding 'Sl'
        const updatedData = { ...rest, createdBy: this.Auth.GetLoginuserDbId() }; // Add 'createdBy' with an empty string
        oPrescriptionDetails.push(updatedData); // Push the updated object into the array
      });
       var  formValue = this.AppointmentForm.value;
      formValue.prescriptionDetails =  oPrescriptionDetails;
    if(oPrescriptionDetails.length<=0){
      this.CommonService.ErrorMessage (`There are No Prescription Details.!! Please Add Details`); 
      return;
    }

    for(var i=0;i<oPrescriptionDetails.length;i++){
      if(oPrescriptionDetails[i].medicinId==0 || oPrescriptionDetails[i].medicinId==null || oPrescriptionDetails[i].medicinId==undefined){
        this.CommonService.ErrorMessage (`Please Select Medicine in Row ${i+1}`); 
        return;
      }
      if(oPrescriptionDetails[i].dosage=="" || oPrescriptionDetails[i].dosage==null || oPrescriptionDetails[i].dosage==undefined){
        this.CommonService.ErrorMessage (`Please Type Dosage in Row ${i+1}`); 
        return;
      }
      if(oPrescriptionDetails[i].startDateSt=="" || oPrescriptionDetails[i].startDateSt==null || oPrescriptionDetails[i].startDateSt==undefined){
        this.CommonService.ErrorMessage (`Please Select Start Date in Row ${i+1}`); 
        return;
      }
      if(oPrescriptionDetails[i].endDateSt=="" || oPrescriptionDetails[i].endDateSt==null || oPrescriptionDetails[i].endDateSt==undefined){
        this.CommonService.ErrorMessage (`Please Select End Date in Row ${i+1}`); 
        return;
      }
    }
    console.log(formValue);

    if(formValue.id==0){
      this.isLoading = true;
      debugger;
      this.AppointmentService.Create(formValue)
      .subscribe(o => {
        this.isLoading = false;
        console.log(o);
          if (o.message=="1") {
            debugger;
             this.CommonService.SaveMessage(`Sucessfully Data Saved `);
            this.location.back();
          } else {
            this.CommonService.ErrorMessage (o.message);
          }
      }, o => {
        this.CommonService.ErrorMessage (`Invalid entry`);

      });
    }else {
      this.isLoading = true;

        this.AppointmentService.Update(formValue).subscribe(
          (response: any) => {
            this.isLoading = false;

            console.log(response);
            if (response.message === "2") {
              this.CommonService.SaveMessage('Successfully Updated Data');
              this.location.back();
            } else {
              this.CommonService.ErrorMessage(response.message);
            }
          },
          (error : any) => {
            this.CommonService.ErrorMessage('Invalid entry');
          });
        }
    } else {
      debugger;
      for (const key of Object.keys(this.AppointmentForm.controls)) {
        const control = this.AppointmentForm.get(key);
        if (control && control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
            // Show only the first validation error and stop checking further
          if (control.errors?.['required']) {
            this.CommonService.ErrorMessage(this.getValidationMessage(key, 'required'));
            return;
          }
          if (control.errors?.['minlength']) {
            this.CommonService.ErrorMessage(this.getValidationMessage(key, 'minlength'));
            return;
          }
          if (control.errors?.['min']) {
            this.CommonService.ErrorMessage(this.getValidationMessage(key, 'min'));
            return;
          }
        }
      }
    }


  }

// Function to return validation messages dynamically
getValidationMessage(field: string, type: string): string {
  const messages: any = {

    patientId: {
      required: "Patient is required.",
      min: "Please select a  Patient."
    },
    doctorId: {
      required: "Doctor is required.",
      min: "Please select a doctor."
    },
    diagnosis: {
      required: "Diagnosis is required.",
      min: "Please Type Diagnosis."
    }
  };
  return messages[field]?.[type] || "Invalid input.";
}


  onClose(): void {
    this.location.back(); // Example: Navigate to the previous page
  }

  public colDefs: ColDef[] = [
      {valueGetter: "node.rowIndex + 1", headerName: 'SL', cellStyle: { 'border-right': '0.5px solid silver' }, width: 60, editable: false, filter: false},
       { field: 'medicinId', headerName: 'medicine Id', cellStyle: { 'border-right': '0.5px solid silver', 'text-align': 'left'  } , width: 150, editable: false,  hide: true , headerClass: 'center-header'},
      {    field: 'medicineName',      headerName: 'Medicine Name',      cellStyle: { 'border-right': '0.5px solid silver', 'text-align': 'left' },      width: 150,      editable: true,      headerClass: 'center-header',      cellEditor: MedicineDropdownEditorComponent,      cellEditorParams: { getMedicines: () => this.Medicines }    },
      { field: 'dosage', headerName: 'Dosage', cellStyle: { 'border-right': '0.5px solid silver', 'text-align': 'left'  },editable: true,width: 150, headerClass: 'center-header' ,filter: false },
      
       { field: 'startDateSt', headerName: 'Start Date', cellStyle: { 'border-right': '0.5px solid silver', 'text-align': 'center'  } ,width: 100, headerClass: 'center-header', editable: true ,cellEditor:DatepickerEditorComponent ,filter: false  },
       { field: 'endDateSt', headerName: 'End Date', cellStyle: { 'border-right': '0.5px solid silver', 'text-align': 'center'  } ,width: 100, headerClass: 'center-header', editable: true ,cellEditor:DatepickerEditorComponent ,filter: false  },
      
      { field: 'notes', headerName: 'Notes', cellStyle: { 'border-right': '0.5px solid silver' , 'text-align': 'left'   }, editable: true, width: 100,  headerClass: 'center-header',filter: false },
      
       {
          field: 'Action',
          headerName: 'Action',
          cellRenderer: AppointmentButtonRendererComponent,
          cellStyle: { 'border-right': '0.5px solid silver', 'text-align': 'center' },
          headerClass: 'center-header',
          width:100,
          filter: false
        }
  
  ];
      
  onSelectionChanged = (event: SelectionChangedEvent) => {
    console.log("Row Selected!");
    
  };
  onCellValueChanged = (event: CellValueChangedEvent) => {
 
    debugger;

      const colId = event.column.getColId();
    if(colId=="startDateSt")
      {
        debugger;
        const startDate = this.CommonService.MASdateparser(event.data.startDateSt);
        event.data.startDate = startDate;
        event.data.tempStartDate = event.data.startDateSt;
        event.api.refreshCells({ rowNodes: [event.node], columns: ['startDateSt'] });
      }
  

        if(colId=="endDateSt")
      {
        debugger;
        const endDate = this.CommonService.MASdateparser(event.data.endDateSt);
        event.data.endDate = endDate;
        event.data.tempendDate = event.data.endDateSt;
        event.api.refreshCells({ rowNodes: [event.node], columns: ['endDateSt'] });
      }


  };


  public  LoadOthersControl()  {
    this.isLoading = true;
    this.Appointmentservice.GetMedicalDatas( ).subscribe(
      (data:any) => {
        try {
          debugger;
          this.isLoading = false;
          this.Patients = [{ id: 0, name: 'Select Patient' }, ...data.patients];
          this.Doctors = [{ id: 0, name: 'Select Doctor' }, ...data.doctors];
          this.Medicines = data.medicines;  
          
          this.LoadAppointmentData();
 
          
        } catch (error) {
          console.error('Error parsing data:', error);
        }
      },
      error => {
        console.error('Error deleting user:', error);
      }
    );
  
    }
  public  LoadAppointmentData() 
  {

    if(this.appointmentid !=0 )
      {
        this.isLoading = true; 
        this.AppointmentService.Get(this.appointmentid).subscribe(
          (r: any) => {
            try {
              // Cast response to expected type or handle it directly
              this.isLoading = false;
              debugger;
              this.Appointment = r as any;
              const databaseDate = this.Appointment?.appointmentDate || new Date().toISOString().slice(0, 10);  
              const formattedDate = databaseDate.split('T')[0]; 

               this.AppointmentForm = this.fb.group({
                id: [this.Appointment?.id ||0 ],
                patientId: [this.Appointment?.patientId || 0, [Validators.required, Validators.min(1)]],
                doctorId: [this.Appointment?.doctorId || 0, [Validators.required, Validators.min(1)]],
                appointmentDate:[formattedDate || new Date().toISOString().slice(0, 10)],  //// Formats to YYYY-MM-DD
                visitType: [this.Appointment?.visitType],
                diagnosis: [this.Appointment?.diagnosis || ""],
                note: [this.Appointment?.note || "", [Validators.required]],
                createdBy: [this.Auth.GetLoginuserDbId()],
                lastModifiedBy: [this.Auth.GetLoginuserDbId()]
              });
              var AppointmentDetils :any = this.Appointment.prescriptionDetails;

              this.LoadDetailData(AppointmentDetils);

             
            } catch (error) {
              console.error('Error processing Appointment data:', error);
            }
          },
          (error :any) => {
            console.error('Error fetching Appointment:', error);
          }
        );
        
      }
    
  }






 LoadDetailData(AppointmentDetils:any)
 {

  this.rowDataDetail = AppointmentDetils.map((item: any, index: number) => ({
    //Sl:  index + 1, 
    id: item.id,
    appointmentId:item.appointmentId, 
    medicinId:item.medicinId,
    medicineName : item.medicineName,

    dosage:item.dosage,
    notes:item.notes,

    startDate: item.startDate,  
    startDateSt: item.startDateSt,
    tempStartDate: item.startDateSt,   

    endDate: item.endDate,  
    endDateSt: item.endDateSt,
    tempEndDate:item.endDateSt
   
  }));

 }

 onGridReady(params: GridReadyEvent) {
  debugger;
  this.gridApi = params.api;  // Capture the gridApi on grid initialization
  params.api.sizeColumnsToFit();
  
}



  activeIndex: number = -1;
  products :any = [
  
  ]; // Example product list
  suggestionsBox :any = document.getElementById("suggestions");
  filteredProducts : any = [];
 // Handling input event with `any` type


}
