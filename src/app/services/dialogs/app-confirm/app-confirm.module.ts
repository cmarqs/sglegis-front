import { 
  MatDialogModule,
  MatButtonModule
 } from '@angular/material';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComfirmComponent } from './app-confirm.component';
import { AppConfirmService } from './app-confirm.service';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  exports: [AppComfirmComponent],
  declarations: [AppComfirmComponent],
  providers: [AppConfirmService],
  entryComponents: [AppComfirmComponent]
})
export class AppConfirmModule { }