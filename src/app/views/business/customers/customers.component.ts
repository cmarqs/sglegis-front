import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { profile } from 'app/models/auth/profile.types';
import { CampoBusca } from 'app/models/base/negocio/CampoBusca';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';
import { CustomersFormsComponent } from './customers-forms/customers-forms.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  lastSearch: any;
  rows = [];
  
  columns = [
    {
      Propriedade: 'customer_group_name',
      Titulo: 'Grupo',
      Visivel: true,
      Largura:100
    },    
    {
      Propriedade: 'customer_business_name',
      Titulo: 'Razão Social',
      Visivel: true,
      Largura:200
    },
    {
      Propriedade: 'customer_cnpj',
      Titulo: 'CNPJ',
      Visivel: true,
      Largura:100
    }
  ]

  configSearch = [
    new CampoBusca("filter", "Grupo", 50, "", "string", null, null, null)
  ];
  currentUser: any = {};
  profile = profile;

  constructor(
    private crud: CRUDService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,    
    private auth: AuthGuard,
  ) { }

  prepareScreen() {
    this.currentUser = this.auth.getUser();
    this.getCustomers(undefined);
    
  }

  openForm(info: any = {}, newRercord: Boolean) {
    let text;     
    text = (newRercord) ? "Nova Matriz" : "Editar Matriz: " + info.customer_id;    
    
    let dialogRef: MatDialogRef<any> = this.dialog.open(CustomersFormsComponent, {
      width: '720px',
      disableClose: true,
      data: { title: text, payload: info, new: newRercord }
    });

    dialogRef.afterClosed()
    .subscribe(res => {      
      this.getCustomers(this.lastSearch);
      return;
    });
  }
  
  getCustomers(parameter: any) {
    this.lastSearch = parameter;
    this.crud.GetParams(this.lastSearch, "/customer").subscribe(res => {
      this.rows = [];
      this.rows = res.body;
    })
  }

  ngOnInit() {
    this.prepareScreen();
  }
  

}
