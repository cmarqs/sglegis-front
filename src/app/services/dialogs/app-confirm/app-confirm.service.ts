import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';
import { AppComfirmComponent } from './app-confirm.component';

@Injectable()
export class AppConfirmService {

  constructor(public dialog: MatDialog) { }

  public confirm(title: string, message: string): Observable<boolean> {
    let dialogRef: MatDialogRef<AppComfirmComponent>;
    dialogRef = this.dialog.open(AppComfirmComponent, {
      width: '380px',
      disableClose: true,
      data: {title, message}
    });
    return dialogRef.afterClosed();
  }

  async openDialog(title: string, message: string): Promise<boolean> {
    let dialogRef: MatDialogRef<AppComfirmComponent>;
    dialogRef = this.dialog.open(AppComfirmComponent, {
      width: '380px',
      disableClose: true,
      data: {title, message}
    });
   
    return dialogRef.afterClosed()
      .toPromise() // here you have a Promise instead an Observable
      .then(result => {
         console.log("The dialog was closed " + result);
         return Promise.resolve(result); // will return a Promise here
      });
   }
}