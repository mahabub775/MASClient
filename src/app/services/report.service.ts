import { Injectable } from '@angular/core';
import {CommonService} from '../services/common.services';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs';  // Import Day.js
import 'dayjs/locale/bn';   // Import Bengali locale if necessary
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient, public CommonService: CommonService) { }
 // url: string = '/Reports/'
 

  //#endregion
  getheaderfooter(bIsEn: boolean, bIsHeader: boolean): any {

    if (bIsHeader) {
      return {
        srcimg: "../../../assets/MAS_icon.JPG" ,
        MainHead: 'South Breeze',

        fontName: bIsEn ? "Roboto" : "Baloda"
      };
    }
    else {

      return {
        printdate: bIsEn ? " Print Date & Time: " + this.CommonService.MASdatetimeformat(new Date()) : "প্রিন্টের  তারিখ ও সময় : " + this.CommonService.MASdatetimeformat(new Date()),
        footersubtext: bIsEn ? "Page No:" : " পৃষ্ঠা নম্বর :",
        fontName: bIsEn ? "Roboto" : "Baloda"
      };
    }

  }

  //#region date format

  //#region  Logo draw\

  async CreateHeader(bIsEn :boolean, customheader : string) {
    debugger;
    const oHeaderObj = {
      srcimg: "/assets/MAS_icon.JPG",
      MainHead: bIsEn ? 'SOUTH BREEZE HOUSING LTD.' : 'সাউথ ব্রিজ হাউজিং লিমিটেড।',
      fontName: bIsEn ? "Roboto" : "Baloda"
    };
  
    const base64Image = await this.getBase64ImageFromURL(oHeaderObj.srcimg);
  
    const obj = {
      margin: 10,
      widths: ['100%'],
      border: [false, false, false, false],
      columns: [
        {
          style: { alignment: 'center' },
          table: {
            widths: ['20%', '60%', '20%'],
            body: [
              [{border: [false, false, false, false], image: base64Image,width: 65, height: 62,alignment: 'center',fontSize:25,bold: true,rowSpan: 3},

                {border: [false, false, false, false],text: oHeaderObj.MainHead ,alignment: 'center',fontSize: 20,bold: true},
                {border: [false, false, false, false],text: '',alignment: 'center',bold: true,rowSpan: 3}
              ],
              //
              [{}, { border: [false, false, false, false], text: "SOUTH BREEZE CENTER, Road 11, Building 05,  Block G, 12th Floor, Banani, Dhaka 1213", alignment: 'center', fontSize: 9, bold: false }, {}],
              [{}, { border: [false, false, false, false], text:customheader, alignment: 'center', fontSize: 15, style: { font: oHeaderObj.fontName }, bold: true }, {}],
              
            ]
          }
        }
      ]
    };
  
    return obj;
  }

  static CreateFooter(currentPage: number, pageCount: number) {
    // let ln = localStorage.getItem('lan');
    // ln = ln ? ln : "en";
    // let bIsEn = ln == "en" ? true : false;
    let bIsEn = true;
    var pagc = bIsEn ? currentPage.toString() + ' of ' + pageCount : this.SwitchEngBan(pageCount) + ' এর ' + this.SwitchEngBan(currentPage.toString());

    var oFooterObj = {
      printdate: bIsEn ? " Print Date & Time: " + ReportService.MASdatetimeformat(new Date()) : "প্রিন্টের  তারিখ ও সময় : " + ReportService.MASdatetimeformat(new Date()),
      footersubtext: bIsEn ? "Page No:" : " পৃষ্ঠা নম্বর :",
      fontName: bIsEn ? "Roboto" : "Baloda"
    };
    var obj = {
      table: {
        widths: ['30%', '60%', '10%'],
        body: [
          [
            { border: [false, false, false, false], text: oFooterObj.printdate, style: { font: oFooterObj.fontName, fontSize: 7 } },
            { border: [false, false, false, false], text: "", fontSize: 7 },
            { border: [false, false, false, false], text: oFooterObj.footersubtext + "  " + pagc, style: { font: oFooterObj.fontName, fontSize: 7 } },
          ]
        ]
      }
    };
    return obj;
  }


  getBase64ImageFromURL(url :string) {
    return new Promise((resolve, reject) => {
      debugger;
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx :any = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
  
      img.onerror = (error) => {
        reject(error);
      };
  
      img.src = url;
    });
  }
  //#endregion




  //use these function for report 
  static MASdateformat(date: any) {
    // Use Day.js to parse the date
    var ddd = dayjs(date);

    // Get the language preference from localStorage
    let ln = localStorage.getItem('lan');
    ln = ln ? ln : "en";
    let bIsEn = ln == "en" ? true : false;

    // Define month names based on language preference
    var mthNames = bIsEn ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] : ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

    // Get year, month, and day using Day.js
    var y = ddd.year();
    var m = ddd.month();
    var d = ddd.date();

    // Format the date in the desired format
    var result = d + ' ' + mthNames[m] + ' ' + y;
    console.log(result);

    return result;
}

  //use these function for report 
  static MASdatetimeformat(date :Date) {
    let ln = "en";  ///localStorage.getItem('lan');
    ln = ln ? ln : "en";
    let bIsEn = ln == "en" ? true : false;

        
    var mthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = ReportService.nanoCustomStringFormat(date.getDate(), '00');
    var hours :any = date.getHours();
    var ampm = (hours >= 12) ? ln == "en" ? 'PM' : 'পি.এম' : ln == "en" ? 'AM' : 'এ.এম';
    hours = ReportService.nanoCustomStringFormat(((hours >= 12) ? ((hours % 12 == 0) ? 12 : hours % 12) : (hours == 0) ? 12 : hours), '00');
    var minutes = ReportService.nanoCustomStringFormat((date.getMinutes()), '00');

    //return m+'/'+d+'/'+y;
    var result = d + ' ' + mthNames[m] + ' ' + y + ' ' + hours + ':' + minutes + ' ' + ampm;
    //অপরাহ্ন
    return  result;
  }





  static SwitchEngBan(n: any) {
    let num = n.toString();
    if (!num) {
      return "";
    }

    let en = "1234567890,.-/";
    let bn = "১২৩৪৫৬৭৮৯০,.-/";
    let res = "";
    for (let index = 0; index < num.length; index++) {
      const i = num[index];
      res += en.search(i) > -1 ? bn[en.search(i)] : bn.search(i) > -1 ? en[bn.search(i)] : i;
    }
    return res;
  }

  //return date from a string date format like "01 Oct 2014 12:34 PM"
  static nanodatetimeparser(s :any) {
    var mthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (!s) return new Date();
    var ss = (s.split(' '));
    var d = parseInt(ss[0], 10);
    var m = ReportService.stringarrayindex(mthNames, ss[1]) + 1;
    var y = parseInt(ss[2], 10);
    var hourmin = ss[3].split(':');

    var hours = parseInt(hourmin[0], 10);
    var minutes = parseInt(hourmin[1], 10);
    var ampm = ss[4];
    hours = ampm == 'PM' ? (hours == 12 ? 12 : hours + 12) : (hours == 12 ? 0 : hours);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d) && !isNaN(hours) && !isNaN(minutes)) {
      return new Date(y, m - 1, d, hours, minutes);
    } else {
      return new Date();
    }
  }

  static nanoCustomStringFormat(nInteger : any, sFormat:string) {
    var sInteger = nInteger.toString();
    var lenDIff;
    (sFormat.length > sInteger.length) ? lenDIff = sFormat.length - sInteger.length : lenDIff = 0;
    return sFormat.substring(0, lenDIff) + sInteger;
  }
  static stringarrayindex(aArray :any, sItem :any) {
    if (aArray == null) return -1;
    for (var i = 0; i < aArray.length; i++) {
      if (aArray[i] == sItem) {
        return i;
      }
    }
    return -1;
  }
  //#endregion


GetBorderLayout() {
  return {
    hLineWidth: function () { return 0.5; },
    vLineWidth: function () { return 0.5; },
    hLineColor: function () { return '#999'; },
    vLineColor: function () { return '#999'; }
  };
}



}
//#region  Excel Import
@Injectable({
  providedIn: 'root'
})
export class ExportService {
  exportToExcel(data: any[], headers: string[], alignments: { [key: string]: { horizontal: string, vertical: string } }, headerMappings: { [key: string]: string }, fileName: string) {
    // Step 1: Add SL# to the headers
    const headerRow = ['SL#', ...headers];

    // Step 2: Map data keys to headers and prepend SL#
    const mappedData = data.map((item, index) => [
      index + 1, // SL# starts from 1
      ...Object.keys(headerMappings).map((key) => item[key] || ''), // Map list data to headers
    ]);

    // Step 3: Combine headers and data into a 2D array
    const worksheetData = [headerRow, ...mappedData];

    // Step 4: Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Step 5: Apply header styling (bold and center alignment for all headers)
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']!); // Decode worksheet range
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // Header row (row 0)
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          font: { bold: true }, // Apply bold font to header cells
          alignment: { horizontal: 'center', vertical: 'center' }, // Center alignment for headers
        };
      }
    }

    // Step 6: Apply column-specific data alignment based on the passed alignments
    for (let row = 1; row <= headerRange.e.r; row++) {  // Loop through all rows (excluding header)
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {  // Loop through all columns
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (worksheet[cellAddress]) {
          // Get the alignment settings for the column from the 'alignments' config
          const columnName = headerRow[col]; // Get the column header name
          const alignment = alignments[columnName] || { horizontal: 'left', vertical: 'center' }; // Default alignment

          // Apply the alignment to the cell
          worksheet[cellAddress].s = {
            alignment: alignment, // Apply the alignment for this column
          };
        }
      }
    }

    // Step 7: Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Step 8: Write the workbook to a file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
}
//#endregion