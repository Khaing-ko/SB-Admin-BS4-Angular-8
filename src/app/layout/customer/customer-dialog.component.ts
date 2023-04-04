import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IntlService } from '@progress/kendo-angular-intl';
import { CustomerService } from '../../core/service/customer.service';
import { Customer } from '../../core/model/customer';
import { ThemeService } from 'ng2-charts';
import { CustomerType } from '../../core/model/customer-type';
import { CustomertypeService } from '../../core/service/customertype.service';

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.scss']
})
export class CustomerDialogComponent {
  public saveUrl = 'http://localhost:3600/api/FileService/Upload/Temp';
  public removeUrl = 'http://localhost:3600/api/FileService/Upload/TempRemove';
  public uploadComplete = false;
  public fileName: string = '';
  uploadedFileNames: string[] = [];
  public customertypes: CustomerType[];
  customerformGroup: FormGroup;
  active = false;
  @Input() public isNew = false;

  @Input() public set model(customerobj: Customer) {

    if (customerobj !== undefined) {
      if (customerobj.CustomerId == undefined)  //New, can't use isNew flag because of delay of Input. 
      {
        this.customerformGroup = new FormGroup({
          CustomerName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
          RegisterDate: new FormControl(new Date()),
          CustomerAddress: new FormControl(''),
          CustomerTypeId: new FormControl(0),
          CustomerPhoto: new FormControl(''),
        });
      }
      else {  //Edit
        this.customerformGroup = new FormGroup({
          CustomerId: new FormControl(customerobj.CustomerId),
          CustomerName: new FormControl(customerobj.CustomerName, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
          RegisterDate: new FormControl(this.intl.parseDate(this.intl.formatDate(customerobj.RegisterDate, 'yyyy-MM-dd'))),
          CustomerAddress: new FormControl(customerobj.CustomerAddress),
          CustomerTypeId: new FormControl(customerobj.CustomerTypeId),
          CustomerPhoto: new FormControl(customerobj.CustomerPhoto)
        });
      }
    }

    this.active = customerobj !== undefined;
  }
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<Customer> = new EventEmitter();

  constructor(
    private customerservice: CustomerService,
    private customertypeService: CustomertypeService,
    private intl: IntlService
  ) { }

  ngOnInit(): void {
    this.customertypeService.getCustomerTypes().subscribe(res => this.customertypes = res);
  }


  public onSave(e): void {
    e.preventDefault();
    var regDate = new Date(this.customerformGroup.value.RegisterDate.getTime() - (this.customerformGroup.value.RegisterDate.getTimezoneOffset() * 60000));  // localtimemilisecond - (utcoffsetminute * 60 * 1000)
    this.customerformGroup.patchValue({ RegisterDate: regDate });
    this.save.emit(this.customerformGroup.getRawValue());
    this.active = false;
  }

  public onCancel(e): void {
    e.preventDefault();
    this.closeForm();
  }

  private closeForm(): void {
    this.active = false;
    this.cancel.emit();
  }

  public restrictions = {
    allowedExtensions: ['.jpg', '.png', '.gif'],
    maxFileSize: 1000000
  };


  public onRemove(e): void {
    console.log('File removed:', e);
  }

  public onSuccess(e): void {
    console.log('File uploaded:', e);
    this.uploadComplete = true;
    this.fileName = e.files[0].name;
  }

  public onUpload(e): void {
    console.log('File upload initiated:', e);
  }

  public moveFile(): void {
    console.log('Moving file:', this.fileName);
    // make a request to move the file to the specified location
  }
  onFileUpload(e: any) {
    if (e.files && e.files.length > 0) {
      this.fileName = e.files[0].name;
      console.log('Uploaded file name:', this.fileName);
      this.customerformGroup.get('CustomerPhoto').setValue(this.fileName);

    }
  }
}