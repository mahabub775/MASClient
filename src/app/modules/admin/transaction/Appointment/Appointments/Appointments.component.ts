import { Component, OnInit } from '@angular/core';

import { AppConfig } from '../../../../../core/AppConfig';
import { CommonService } from '../../../../../services/common.services';
import { AGGridHelper } from '../../../../../core/AGGridHelper';
import { Router } from '@angular/router';
import {ReportService, ExportService} from '../../../../../services/report.service';
import { AdminlayoutComponent } from '../../../adminlayout.component'; 
import { NonNullableFormBuilder } from '@angular/forms';
import {PrescriptionPreview} from '../prescriptionPreview'
import { ViewEncapsulation } from '@angular/core';

import { NzModalService } from 'ng-zorro-antd/modal';
import {AuthService} from '../../../../../core/services/auth.services';
import type { CellValueChangedEvent, ColDef,   GridApi,  GridReadyEvent, CellClickedEvent,    SelectionChangedEvent } from "ag-grid-community";

import { ActivatedRoute } from '@angular/router';


import { HttpClient } from "@angular/common/http";

import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AppointmentService } from '../../../../../services/appointment.service'; 
import pdfMake from 'pdfmake/build/pdfmake';
import { NzDatePickerSizeType } from 'ng-zorro-antd/date-picker';
import { sortAscendingPriority } from '@angular/flex-layout';
@Component({
  selector: 'app-Appointments',
  styles:`.formcontrol {
  margin-bottom: 16px;
}
.label {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
}
.button-wrapper {
  display: flex;
 
  justify-content: flex-start;
  margin-bottom: 5px;
}

.search-button {
  width: 100%; /* Default to full width */
   //padding: 6px 16px;
  //background-color: #8b5cf6; /* Tailwind: bg-purple-500 */
  color: white;
  border-radius: 6px;
  border: none;
}

@media (min-width: 992px) {
  .search-button {
    width: 65px; /* Fixed width on large screen */
  }
}
`,
  templateUrl: './Appointments.component.html',
 
  encapsulation: ViewEncapsulation.None,

})
export class AppointmentsComponent implements OnInit {
  selectedOption: string = 'Pdf';
  private gridApi!: GridApi;
  public defaultColDef = AGGridHelper.DeafultCol;
  mode: string | any = 0;
  size: NzDatePickerSizeType = 'default';
  selectedDateRange: Date[] = [];
  isLoading: boolean = false;
  userRole :string;


Suppliers :any; 
Projects : any;
Purchasers:any;
    fontName:any="";
    searchmodel = {
      patientordoctor:''
    };
    
    bIsEn:boolean = true;
    totalRecords = 0; // Total number of records
    pageSize = AppConfig.PaginationPageSize; // Records per page
    pageIndex:number = 1; // Current page index


public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  public value!: string;


  public rowData: any[] = [];
  constructor(    private fb: NonNullableFormBuilder, private nzmodal: NzModalService,private ar: ActivatedRoute ,  private Auth : AuthService, private reportService :ReportService, private commonService : CommonService,  private exportService:ExportService,  private router: Router,  private MenuComponent: AdminlayoutComponent,    private http: HttpClient,    private Appointmentservice: AppointmentService,
    private PrescriptionPreview:PrescriptionPreview 

   ) { 
    var logininfo = this.Auth.GetuserLoginInfo();
    this.userRole = logininfo != null && logininfo.userRoles.length > 0 ? logininfo.userRoles[0] : "";
    this.fontName = this.bIsEn?"Roboto":"Baloda";

  }

  ngOnInit() {
      
        var sObj :any =  sessionStorage.getItem("AppointmentSearchObj");
       
        this.Search();
        
  }




  public colDefs: ColDef[] = [
    { field: 'Sl', headerName: 'SL', cellStyle: { 'border-right': '0.5px solid silver' } ,  headerClass: 'center-header',  width: 10, editable: false, filter: false },
    { field: 'PatientName', headerName: 'Patient', cellStyle: { 'border-right': '0.5px solid silver', 'text-align': 'center'  }, width: 130,  headerClass: 'center-header', filter: false },
    { field: 'DoctorName', headerName: 'Doctor', cellStyle: { 'border-right': '0.5px solid silver', 'text-align': 'center'  } , width: 130,  headerClass: 'center-header'},
    { field: 'AppointmentDateSt', headerName: 'Date', cellStyle: { 'border-right': '0.5px solid silver', 'text-align': 'center'  } , width:80,  headerClass: 'center-header', filter: false},
    { field: 'VisitTypeSt', headerName: 'Visit Type', cellStyle: { 'border-right': '0.5px solid silver', 'text-align': 'left'  },width:80,   headerClass: 'center-header',autoHeight: true }, 
    { field: 'Diagnosis', headerName: 'Diagnosis', cellStyle: { 'border-right': '0.5px solid silver', 'text-align': 'left' }, width: 70,  headerClass: 'center-header',  filter: false},
    
    {
      field: 'Action',
      headerName: 'Actions',
      cellRenderer: (params:any) =>
        {
        const id = params.data.Id; // Access the data from the row
    return `
        <button nz-button nzType="primary" class="edit-btn px-2 py-.5 bg-cyan-500 text-white rounded-md" data-id= "${id}">Edit</button>
        <button nz-button nzType="default" class="del-btn btn-danger px-2 py-.5 bg-cyan-500 text-white rounded-md" data-id= "${id}"> Delete </button>
        <button nz-button nzType="primary" class="print-btn px-2 py-.5 bg-sky-500 text-white rounded-md" data-id= "${id}">Download</button>
        
      `;
      },
      cellStyle: { 'border-right': '0.5px solid silver', 'text-align': 'center' },  headerClass: 'center-header',
      filter: false
  }


  ];


getActiveOption(): string | null {
  const activeOption = document.querySelector('.ant-select-item-option-active');
  return activeOption ? activeOption.textContent : null;
}



trackById(index: number, item: any): number {
  return item.id;
}
products: any[] = [];

onInput(e: Event): void {
  const value = (e.target as HTMLInputElement).value;
//debugger;
  if(value.length>2)
    {
    
    this.isLoading = true;


  }

}



  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;  // Capture the gridApi on grid initialization
    params.api.sizeColumnsToFit();

    params.api.addEventListener('cellClicked', (event: CellClickedEvent) => {
      const target = (event.event as any).target as HTMLElement;

      if (target.classList.contains('edit-btn')) {
          const id = target.getAttribute('data-id');
          this.Edit(id as any);

      } else if (target.classList.contains('del-btn')) {
        //debugger;
          const id = target.getAttribute('data-id');
          this.showDeleteConfirmation(id);
      } else if (target.classList.contains('view-btn')) {
          const id = target.getAttribute('data-id');
          this.View(id as any);

      }
    
      
      else if (target.classList.contains('print-btn')) {

        //debugger;

          const id :any = target.getAttribute('data-id');
          this.PrescriptionPreview.generatePdf(id);
      }
  });
  }
  showDeleteConfirmation(id: any) {
    debugger;
    this.nzmodal.confirm({
      nzTitle: 'Are you sure want to delete this record?',
      nzOnOk: () => this.Delete(id),
    });
  }
 

  New(){  

    sessionStorage.setItem("AppointmentSearchObj",JSON.stringify(this.searchmodel));
    this.router.navigate(['trans/appointments', 0, 'new']);
    
  }

  Delete(Id:string) :void  {
    //debugger;
    this.Appointmentservice.Delete(Id).subscribe(
      (Messageobj:any) => {
        debugger;
        if(Messageobj!=null && Messageobj.message=='Deleted'){
        this.Search();
        }else{
          this.commonService.ErrorMessage (Messageobj.message); 
        }
      },
      error => {
        console.error('Error deleting user:', error);
      }
    );
  }

  Edit(Id:string){
    //if()
    sessionStorage.setItem("AppointmentSearchObj",JSON.stringify(this.searchmodel));
    this.router.navigate(['trans/appointments', Id, 'edit']);
  }

  View(Id:string){
    sessionStorage.setItem("AppointmentSearchObj",JSON.stringify(this.searchmodel));
    this.router.navigate(['trans/appointments', Id, 'view']);
  }


  onSelectionChanged = (event: SelectionChangedEvent) => {
    console.log("Row Selected!");
  };
  onCellValueChanged = (event: CellValueChangedEvent) => {
    console.log(`New Cell Value: ${event.value}`);
  };


  get startRecord(): number {
    return (this.pageIndex - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(this.pageIndex * this.pageSize, this.totalRecords);
  }


 public Search() {
  debugger;
  this.Appointmentservice.GetsWithPagination(this.pageIndex, this.searchmodel.patientordoctor ).subscribe(
  (data:any) => {
    try {
      debugger;
    const items = data.items;
    this.totalRecords = data.totalRecords; 
    this.pageIndex = data.pageIndex;

    const startSl = (this.pageIndex - 1) * this.pageSize; // Calculate starting serial number for the current page.
      //let i = 0;
      this.rowData = items.map((item: any, index: number) => ({
        Sl: startSl + index + 1, // Calculate the serial number for each item.
        Id: item.id,
        PatientName:item.patientName,
        DoctorName: item.doctorName,
        AppointmentDateSt: item.appointmentDateSt,
        VisitTypeSt : item.visitTypeSt,
        Diagnosis : item.diagnosis,
        Note: item.note
       
      }));

    } catch (error) {
      console.error('Error parsing data:', error);
    }
  },
  error => {
    console.error('Error deleting user:', error);
  }
  );
}




//#region  Print

//dTempStyle:any;
dTempStyle = {
  tableExample:{
  widths: '*'
    }
};

async PrintListinPdf(data:any)
{
var nComonFontSize=10;
var sTitle='List of Appointments';
var oHeaderRow:any = await this.reportService.CreateHeader(true, sTitle);

debugger;
//oHeaderRow.columns[0].table.body.push([headerRow]);

  var printingDoc :any = { 
    pageOrientation: 'landscape',
    footer: function(currentPage :any, pageCount :any) { return  ReportService.CreateFooter(currentPage, pageCount)
    },
    header: oHeaderRow,
    content: [ ],
pageMargins:  [ 40, 100, 30, 30 ],
styles:this.dTempStyle
};
this.PrintItems(printingDoc,data);//Print List
pdfMake.createPdf(printingDoc).open();
}

PrintItems(printingDoc:any, data:any)
{
  var nComonFontSize = 9;
  var nCount :number= 0;

var colcaption:any = {
  styles:'tableExample',
  table: {
      // headerRows:2,
      widths: ['6%', '8%', '8%', '10%', '15%', '14%', '8%' , '9%' , '9%' , '13%'],
      body: [ //header
        [
          { border: [true, true, true, true], text:  "SL#", bold: true, alignment: 'center', fontSize: nComonFontSize },
          { border: [true, true, true, true], text:  "AppointmentNo" , bold: true, alignment: 'center', fontSize: nComonFontSize },
          { border: [true, true, true, true], text:  "Appointment Type", bold: true, alignment: 'center', fontSize: nComonFontSize },
          { border: [true, true, true, true], text:"NO Of Requisition" , bold: true, alignment: 'center', fontSize: nComonFontSize },
          { border: [true, true, true, true], text:  "Product", bold: true, alignment: 'left', fontSize: nComonFontSize },
          { border: [true, true, true, true], text:  "Project" , bold: true, alignment: 'left', fontSize: nComonFontSize },
          { border: [true, true, true, true], text:  "Issue Date" , bold: true, alignment: 'center', fontSize: nComonFontSize },
          { border: [true, true, true, true], text:  "Status" , bold: true, alignment: 'center', fontSize: nComonFontSize },
          { border: [true, true, true, true], text:  "Total Amount" , bold: true, alignment: 'right', fontSize: nComonFontSize },
          { border: [true, true, true, true], text:  "Remaining Requisition" , bold: true, alignment: 'center', fontSize: nComonFontSize },
                    
        ],
        
          
      ]
  }
};
printingDoc.content.push(colcaption);//value push

data.forEach((element: any) => {
    //debugger;
    nCount++;
    var pAreaValue:any ={
        table: {
          widths: ['6%', '8%', '8%', '10%', '15%', '14%', '8%' , '9%' , '9%' , '13%'],
          body: [ //header
            [
              { border: [true, true, true, true], text: nCount.toString(), alignment: 'center', fontSize: nComonFontSize },
              { border: [true, true, true, true], text: element.AppointmentNo,  alignment: 'center', fontSize: nComonFontSize },
              { border: [true, true, true, true], text: element.AppointmentTypeSt, alignment: 'center', fontSize: nComonFontSize },
              { border: [true, true, true, true], text: element.noOfRequisition, alignment: 'center', fontSize: nComonFontSize },
              { border: [true, true, true, true], text: element.productsName, alignment: 'left', fontSize: nComonFontSize },
              { border: [true, true, true, true], text: element.projectName, alignment: 'left', fontSize: nComonFontSize },
              { border: [true, true, true, true], text: element.issueDateSt, alignment: 'center', fontSize: nComonFontSize },
              { border: [true, true, true, true], text: element.AppointmentStatusSt, alignment: 'center', fontSize: nComonFontSize },
              { border: [true, true, true, true], text: this.commonService.millionFormat(element.totalAmount), alignment: 'right', fontSize: nComonFontSize },
              { border: [true, true, true, true], text: this.commonService.millionFormat(element.remainRequisition), alignment: 'center', fontSize: nComonFontSize },

            ],
        ]
        }
    };
    printingDoc.content.push(pAreaValue);//value push

});
}
//#endregion



  
}

