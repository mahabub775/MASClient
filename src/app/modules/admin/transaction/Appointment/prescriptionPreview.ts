import { Injectable } from '@angular/core';
import { AppointmentService } from '../../../../services/appointment.service';
import {CommonService} from '../../../../services/common.services';
import { ReportService } from '../../../../services/report.service';
import pdfMake from 'pdfmake/build/pdfmake';


// 

@Injectable({
    providedIn: 'root'
  })
export class PrescriptionPreview {

    bIsEn:boolean;
    fontName:any="";
    constructor(private _appointmentservice: AppointmentService, private ReportService:ReportService, public comm:CommonService){
 
        this.bIsEn = true;
        this.fontName = this.bIsEn?"Roboto":"Baloda";

    }

 
    Appointment:any;    PrescriptionDetails:any; PrescriptionDetailsPS:any;
    Appointmentfontsize=13;
    dTempStyle = {
        tableExample:{
        widths: '*',
        height: 20,
          }
      };
    async   generatePdf(id:number)
    {
            var nComonFontSize = 10;
            this._appointmentservice.Get(id).subscribe(async (o: any) => {
              if (o) {       
                    this.Appointment = o;
                    
                    var printingDoc :any = { 
                        pageOrientation: 'portrait',
                        footer: function(currentPage :any, pageCount:any) { return  ReportService.CreateFooter(currentPage, pageCount)
                        },
                       // header: oHeaderRow,
                        content: [{ text: 'Prescription Report', alignment: 'center', fontSize: 14,bold:true,  margin: [0, 0, 0, 5] }],
                    pageMargins:  [ 30, 40, 37, 30],
                    styles:this.dTempStyle
                };
           
                 this.PrintBody(printingDoc);

               //pdfMake.createPdf(printingDoc).open();
               pdfMake.createPdf(printingDoc).download("PrescriptionReport.pdf");
                }

            }, err => {
            alert(err.Message);
            });
    }

PrintBody(printingDoc:any)
{
    
   // var nComonFontSize = 10;
   var nComonFontSize = 11;
  var nCount :number= 0;
  var Appointmentinfo:any = {
        styles:'tableExample',
        table: {
            // headerRows:2,
            widths: ['20%', '80%'],
            body: [ 
              [
                { border: [false, false, false, false], text:  "Patient : ", bold: true, alignment: 'left', fontSize: nComonFontSize },
                { border: [false, false, false, false], text:  this.Appointment.patientName, bold: false, alignment: 'left', fontSize: nComonFontSize },
              ],
              [
                { border: [false, false, false, false], text:  "Doctor : ", bold: true, alignment: 'left', fontSize: nComonFontSize },
                { border: [false, false, false, false], text:  this.Appointment.doctorName , bold: false, alignment: 'left', fontSize: nComonFontSize }
                
              ],
              [
                { border: [false, false, false, false], text:  "Date : ", bold: true, alignment: 'left', fontSize: nComonFontSize },
                { border: [false, false, false, false], text: this.Appointment.appointmentDateSt , bold: false, alignment: 'left', fontSize: nComonFontSize }
              ],

              [
                { border: [false, false, false, false], text:  "Visit Type : ", bold: true, alignment: 'left', fontSize: nComonFontSize },
                { border: [false, false, false, false], text:  this.Appointment.visitTypeSt , bold: false, alignment: 'left', fontSize: nComonFontSize }
                
              ],

               [
                { border: [false, false, false, false], text:  " " , bold: true, alignment: 'left', fontSize: nComonFontSize },
                { border: [false, false, false, false], text:  " " , bold: true, alignment: 'center', fontSize: nComonFontSize }
                
              ],

               [
                { border: [false, false, false, false], text:  "Prescriptions" , bold: true, alignment: 'left', fontSize: 15, colSpan:2 },
                { }
              ],
            ]
        }
      };
      printingDoc.content.push(Appointmentinfo);//value push
      
   

      nComonFontSize = 10;
      var colcaption:any = {
        styles:'tableExample',
        table: {
            // headerRows:2,
            widths: ['30%', '30%', '20%', '20%'],
            body: [ //header
              [
                { border: [true, true, true, true], text: "Medicine" , bold: true, alignment: 'center', fontSize: nComonFontSize },
                { border: [true, true, true, true], text: "Dosage", bold: true, alignment: 'center', fontSize: nComonFontSize },
                { border: [true, true, true, true], text: "Start Date" , bold: true, alignment: 'center', fontSize: nComonFontSize },
                { border: [true, true, true, true], text: "End Date", bold: true, alignment: 'center', fontSize: nComonFontSize },
              ],

            ]
        }
      };
      printingDoc.content.push(colcaption);//value push
      var nAppointmentDetailId:any  = 0;
    
      const tableBody: any[] = [];
      
      nComonFontSize = 10;
    // Group rows by `productId` and handle rowspan
this.Appointment.prescriptionDetails.forEach((element: any, index: number) => {
  if (parseInt(element.id) !== parseInt(nAppointmentDetailId)) {
    nAppointmentDetailId = element.id;
    debugger;

      // Add the first row with rowspan
      tableBody.push([
       
        {text: element.medicineName,alignment: 'left',fontSize: nComonFontSize,margin: [0, 5]},
        { text: element.dosage, alignment: 'left', fontSize: nComonFontSize,  margin: [0, 5] },      
        { text: element.startDateSt , alignment: 'center', fontSize: nComonFontSize , margin: [0, 5]},
        { text: element.endDateSt , alignment: 'center', fontSize: nComonFontSize , margin: [0, 5]},
        
    ]);

    
  }
});

const pPrescriptionVal: any = {
  table: {
      widths: ['30%', '30%', '20%', '20%'],
      body: tableBody,
  },
};

// Add the table to the document content
printingDoc.content.push(pPrescriptionVal);
    

}




}
