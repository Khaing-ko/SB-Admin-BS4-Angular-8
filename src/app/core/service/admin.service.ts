import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from '../../../../node_modules/rxjs';
import { GridDataResult } from '../../../../node_modules/@progress/kendo-angular-grid';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BehaviorSubject<GridDataResult> {

  public loading: boolean;
  constructor(private apiservice: ApiService) {
    super(null);
  }

  getAdminList(girdState: any) {
    this.loading = true;
    this.apiservice.fetchgridpostJson('/Admin/GetAdminList/', girdState)
      .subscribe(x => {
        super.next(x);
        this.loading = false;
      });
  }

  getAdminComboData() {
    return this.apiservice.get('/Admin/GetAdminComboData');
  }
  getBranchComboData(){
    return this.apiservice.get('/Admin/GetBranchComboData');
  }
  getBranchData(data){
    return this.apiservice.postJson('/Admin/GetBranchData/',data);
  }

  addAdmin(adminSet) {
    return this.apiservice.postJson('/Admin/AddAdminSetup/', adminSet);
  }

  updateAdmin(adminSet) {
    return this.apiservice.postJson('/Admin/UpdateAdminSetup/', adminSet);
  }

  deleteAdmin(adminID) {
    return this.apiservice.delete('/Admin/DeleteAdminSetup/' + adminID);
  }
  // uploadFile(functionname, encryptdata, formData) {
  //   return this.apiservice.uploadFile('/FileService/Upload/' + functionname + '/' + encryptdata, formData);
  // }
  // SaveImagePath(ID, FileName) {
  //   const obj = {ID: ID,FileName: FileName};
  //   return this.apiservice.postJson('/admin/SaveImagePath/',obj);
  // }
  // getImagePath(encryptdata,hash) {
  //   return this.apiservice.get('/FileService/Download/AdminPhoto/' + encodeURIComponent(encryptdata) + '/' + encodeURIComponent(hash));
  // }

  getImagePath(id: number): Observable<string> {
    var encryptdata = btoa(id.toString());  //convert to base64
    return this.apiservice.get('/FileService/Download/AdminPhoto/' + encryptdata);
  }

  getProfileImage(): Observable<string> {
    return this.apiservice.get('/FileService/ProfilePhoto');
  }

  deleteAdminPhoto(id: number): Observable<string> {
    var encryptdata = btoa(id.toString());  //convert to base64
    return this.apiservice.postJson('/FileService/Remove/AdminPhoto/' + encryptdata, null);  //single file
  }

  unBlock(adminID: number) {
    return this.apiservice.get('/Admin/unBlock/' + adminID.toString());
  }

  InactivateAdmin(adminID: number) {
    return this.apiservice.get('/Admin/InactivateAdmin/' + adminID.toString());
  }
  ActivateAdmin(adminID: number) {
    return this.apiservice.get('/Admin/ActivateAdmin/' + adminID.toString());
  }
}