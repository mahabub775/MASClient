import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {AuthService} from "../core/services/auth.services"
import { NzMessageService } from 'ng-zorro-antd/message';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private controllerName = 'Common';
  httpOptions  =<any> "";
 private rootURI = '';
  constructor(private message: NzMessageService, private http: HttpClient, private AuthService:AuthService) { 
    this.rootURI = AuthService.rootURI;
    this.httpOptions = { headers:this.AuthService.CurstomHeader() };
  }







  //#region  Message show
SaveMessage(sMessage:string){
  this.message.create('success', sMessage );
}

WaringMessage(sMessage:string){
  this.message.create('warning', sMessage);
}

ErrorMessage(sErrorMessage:string){
  this.message.create('error', sErrorMessage);
}
//#endregion

//#region load indicator
ActionLoading(Message:string): void {
  const id = this.message.loading(Message, { nzDuration: 0 }).messageId;
  setTimeout(() => {
    this.message.remove(id);
  }, 2500);
}
//#endregion


 //#region Concatfields
 PropertyConcatation(oList :any, sProperty:string) {
  var sIDs = "";
  if (oList.length > 0) {
    for (var i = 0; i < oList.length; i++) {
      var oTempField = oList[i];
      sIDs += oTempField[sProperty] + ",";
    }
    return sIDs.substring(0, sIDs.length - 1);
  }
  return sIDs;
}
FindObjects(oList:any, sPropertyName:string, PropertyValue:string) {
  var oNewList = [];
  for (var i = 0; i < oList.length; i++) {
    var oTempList = oList[i];
    if (oTempList[sPropertyName] == PropertyValue) {
      oNewList.push(oTempList);
    }
  }
  return oNewList;
}

ConvertEnumtoList(enumName :any ){
  return  Object.entries(enumName)
      .filter(([key, value]) => !isNaN(Number(value))) // Filter numeric keys
      .map(([key, value]) => ({
        id: value,
        name: key === 'None' ? 'Select One' : key, // Replace 'None' with 'Select One'
      }));
  
}

CalSum(oList :any, sPropertyName:string) {
  var nReturnVal = 0;

  for (var i = 0; i < oList.length; i++) {
    var oTempList = oList[i];
    nReturnVal = nReturnVal + parseFloat(oTempList[sPropertyName]);

  }
  return nReturnVal;
}

GetSum(oList: any[], field: string, bisFloat = false): number {
  if (!oList || oList.length === 0) {
    return 0;
  }

  return oList
    .map(o => bisFloat ? parseFloat(o[field]) || 0 : parseInt(o[field], 10) || 0)
    .reduce((p, c) => p + c, 0);
}

shbldateformat(date:any) {
  var mthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var y = date.getFullYear();
  var m = date.getMonth();
  var d = this.MASCustomStringFormat(date.getDate(), '00');
  //return m+'/'+d+'/'+y;
  var result = d + ' ' + mthNames[m] + ' ' + y;
  return result;
}

   formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Format: DD-MM-YYYY
  }


parseDate(dateStr: string): Date {
  const parts = dateStr.split('-'); // Split by "-"
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-based
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(); // Return today's date as fallback
}

  //return date from a string date format like "01 Oct 2014"
  MASdateparser(s:any) {
    var mthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (!s) return new Date();
    var ss = (s.split(' '));
    var d = parseInt(ss[0], 10);
    var m = this.stringarrayindex(mthNames, ss[1]) + 1;
    var y = parseInt(ss[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m - 1, d);
    } else {
      return new Date();
    }
  }

  MASdatetimeformat(date:any) {
    var mthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = this.MASCustomStringFormat(date.getDate(), '00');
    var hours = date.getHours();
    var ampm = (hours >= 12) ? 'PM' : 'AM';
    hours = this.MASCustomStringFormat(((hours >= 12) ? ((hours % 12 == 0) ? 12 : hours % 12) : (hours == 0) ? 12 : hours), '00');
    var minutes = this.MASCustomStringFormat((date.getMinutes()), '00');


    //return m+'/'+d+'/'+y;
    var result = d + ' ' + mthNames[m] + ' ' + y + ' ' + hours + ':' + minutes + ' ' + ampm;
    return result;
  }


    MASdateformat(date:any) {
    var mthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = this.MASCustomStringFormat(date.getDate(), '00');
    

    
    var result = d + ' ' + mthNames[m] + ' ' + y ;
    return result;
  }



  MASCustomStringFormat(nInteger:any, sFormat:string) {
    var sInteger = nInteger.toString();
    var lenDIff;
    (sFormat.length > sInteger.length) ? lenDIff = sFormat.length - sInteger.length : lenDIff = 0;
    return sFormat.substring(0, lenDIff) + sInteger;
  }
  stringarrayindex(aArray:any, sItem:string) {
    if (aArray == null) return -1;
    for (var i = 0; i < aArray.length; i++) {
      if (aArray[i] == sItem) {
        return i;
      }
    }
    return -1;
  }




 InWords(inputValue: number, beforeDecimal: string, afterDecimal: string): string {
    // if (beforeDecimal === "Dollar") {
    //     return AmountInDallarFormat(inputValue, "awayFromZero");
    // } else {
        let commaCount = 0, digitCount = 0;
        let sign = "", takaWords = "", numStr = "", taka = "", paisa = "", pow = "";
        const pows = ["crore", "thousand", "lac"];

        if (inputValue < 0) {
            sign = "Minus";
            inputValue = Math.abs(inputValue);
        }

        numStr = inputValue.toFixed(2);
        paisa = this.HundredWords(parseInt(this.Right(numStr, 2)));

        if (paisa !== "") {
            paisa = paisa.charAt(0).toUpperCase() + paisa.slice(1);
            paisa = afterDecimal + " " + paisa;
        }

        numStr = this.Left(numStr, numStr.length - 3);
        taka = this.HundredWords(parseInt(this.Right(numStr, 3)));

        if (numStr.length <= 3) {
            numStr = "";
        } else {
            numStr = this.Left(numStr, numStr.length - 3);
        }

        commaCount = 1;
        if (numStr !== "") {
            do {
                if (commaCount % 3 === 0) {
                    digitCount = 3;
                } else {
                    digitCount = 2;
                }

                pow = this.HundredWords(parseInt(this.Right(numStr, digitCount)));
                if (pow !== "") {
                    if (inputValue.toString().length > 10) {
                        pow = pow + " " + pows[commaCount % 3];
                    } else {
                        pow = pow + " " + pows[commaCount % 3];
                    }
                }

                if (taka !== "") {
                    if (pow !== "") {
                        pow = pow + " ";
                    }
                }

                taka = pow + taka;
                if (numStr.length <= digitCount) {
                    numStr = "";
                } else {
                    numStr = this.Left(numStr, numStr.length - digitCount);
                }
                commaCount += 1;

            } while (numStr !== "");
        }

        if (taka !== "") {
            taka = taka.charAt(0).toUpperCase() + taka.slice(1);
            taka = beforeDecimal + " " + taka;
        }
        takaWords = taka;

        if (takaWords !== "") {
            if (paisa !== "") {
                takaWords = takaWords + " and ";
            }
        }
        takaWords = takaWords + paisa;

        if (takaWords === "") {
            takaWords = beforeDecimal + " Zero";
        }
        takaWords = sign + takaWords + " Only";
        return takaWords;
    //}
}

 AmountInWords(inputValue: number, beforeDecimal: string, afterDecimal: string): string {
    return this.InWords(inputValue, beforeDecimal, afterDecimal);
}

 HundredWords(inputValue: number): string {
    let hundredWords = "", numStr = "", pos1 = "", pos2 = "", pos3 = "";
    const digits = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    numStr = this.Right(inputValue.toString().padStart(3, '0'), 3);
    if (this.Left(numStr, 1) !== "0") {
        pos1 = digits[parseInt(this.Left(numStr, 1))] + " hundred";
    } else {
        pos1 = "";
    }

    numStr = this.Right(numStr, 2);
    if (this.Left(numStr, 1) === "1") {
        pos2 = teens[parseInt(this.Right(numStr, 1))];
        pos3 = "";
    } else {
        pos2 = tens[parseInt(this.Left(numStr, 1))];
        pos3 = digits[parseInt(this.Right(numStr, 1))];
    }

    hundredWords = pos1;
    if (hundredWords !== "") {
        if (pos2 !== "") {
            hundredWords = hundredWords + " ";
        }
    }
    hundredWords = hundredWords + pos2;

    if (hundredWords !== "") {
        if (pos3 !== "") {
            hundredWords = hundredWords + " ";
        }
    }
    hundredWords = hundredWords + pos3;

    return hundredWords;
}

Left(str: string, n: number): string {
    return str.substring(0, n);
}

 Right(str: string, n: number): string {
    return str.substring(str.length - n);
}



//Amount


millionFormat(inputValue: number): string {
  //debugger;
  if (inputValue == null || inputValue == 0) return "-";

  // Convert number to string and preserve decimal point
  let num = inputValue.toString();

  // Extract integer and decimal parts
  let [integerPart, decimalPart] = num.split(".");

  // Format integer part with Indian-style commas
  let lastThree = integerPart.slice(-3);
  
  let otherNumbers = integerPart.slice(0, integerPart.length - 3);

  if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
  }

  let formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

 // If there was no integer part larger than 999, just use the integer part
 if (integerPart.length < 3) {
  formatted = integerPart;
}

  // Append decimal part if exists
  if (decimalPart !== undefined) {
      formatted += "." + decimalPart;
  }

  return formatted;
}


removeCommas(formattedValue: string): number {
  if (!formattedValue || formattedValue === "-") return 0; // Handle empty/null cases

  return parseFloat(formattedValue.replace(/,/g, "")); // Remove all commas and convert to number
}

}
