import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { profile } from 'app/models/auth/profile.types';
import { CampoBusca } from 'app/models/base/negocio/CampoBusca';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';
import { AreasFormComponent } from '../areas/areas-form/areas-form.component';
import { DocumentsFormComponent } from './documents-form/documents-form.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit  {

  lastSearch: any;
  rows = [];
  
  columns = [
    {
      Propriedade: 'document_id',
      Titulo: 'Id. Documento',
      Visivel: false,
      Largura: 20
    },
    {
      Propriedade: 'document_number',
      Titulo: 'Número',
      Visivel: true,
      Largura:50
    },
    {
      Propriedade: 'document_date',
      Titulo: 'Data',
      Visivel: true,
      Largura: 80,
      Tipo: "DATA"
    },
    {
      Propriedade: 'document_summary',
      Titulo: 'Ementa',
      Visivel: true,
      Largura:200
    },
    {
      Propriedade: 'document_status_id',
      Titulo: 'Status',
      Visivel: true,
      Largura:10
    },
   
  ]

  configSearch = [
    new CampoBusca("filter", "Grupo", 50, "", "string", null, null, null)
  ];

  profile = profile;
  currentUser: any = {};

  constructor(
    private crud: CRUDService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,    
    private auth: AuthGuard,
  ) { }

  prepareScreen() {    
    this.currentUser = this.auth.getUser();
    this.getDocuments(undefined);    
  }

  openForm(info: any = {}, newRercord: Boolean) {
    let text;     
    text = (newRercord) ? "Novo Documento" : "Editar Documento: " + info.document_id;    
    
    let dialogRef: MatDialogRef<any> = this.dialog.open(DocumentsFormComponent, {
      width: '900px',
      disableClose: true,
      data: { title: text, payload: info, new: newRercord }
    });

    dialogRef.afterClosed()
    .subscribe(res => {      
      this.getDocuments(this.lastSearch);
      return;
    });
  }
  
  getDocuments(parameter: any) {        
    this.crud.GetParams(undefined, "/document").subscribe(res => {
      this.rows = [];
      this.rows = res.body;
    })
  }

  ngOnInit() {
    this.prepareScreen();
  }  
  
}
