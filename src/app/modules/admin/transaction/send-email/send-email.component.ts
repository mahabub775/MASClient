import { Component } from '@angular/core';
import { EmailService } from '../../../../services/email.service';
import { CommonService } from '../../../../services/common.services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html'
})
export class SendEmailComponent {
  email: any = { toEmail: '', subject: '', body: '' };
  selectedFile!: File;
  message = '';

  constructor(private Emnailservice: EmailService, private CommonService:CommonService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  sendEmail() {
    const formData = new FormData();
    formData.append('ToEmail', this.email.toEmail);
    formData.append('Subject', this.email.subject);
    formData.append('Body', this.email.body);
    if (this.selectedFile) {
      formData.append('Attachment', this.selectedFile, this.selectedFile.name);
    }

this.Emnailservice.sendEmail(formData).subscribe({
  next: res => {
    this.message = res.message; // "Email sent successfully!"
  },
  error: err => {
    this.message = "Failed: " + (err.error?.message || "Unknown error");
  }
});

  // this.Emnailservice.sendEmail(formData)
  //     .subscribe(o => {
  //       //this.isLoading = false;
  //       console.log(o);
  //         if (o.message=="1") {
  //           debugger;
  //            this.CommonService.SaveMessage(`Sucessfully Mail Send `);
            
  //         } else {
  //           this.CommonService.ErrorMessage (o.message);
  //         }
  //     }, o => {
  //       this.CommonService.ErrorMessage (`mail Not send due to ${o.message}`);

  //     });


    // this.Emnailservice.sendEmail(formData)
    //   .subscribe({
    //     next: (res) => this.message = res,
    //     error: (err) => this.message = 'Failed: ' + err.error
    //   });
  }
}