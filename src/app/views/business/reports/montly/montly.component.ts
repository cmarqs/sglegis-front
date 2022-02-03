import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { profile } from 'app/models/auth/profile.types';
import { roles } from 'app/models/auth/roles';
import { months } from 'app/models/base/months/monthNames';
import { CampoBusca } from 'app/models/base/negocio/CampoBusca';
import { dialog } from 'app/models/size/size';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';
import { MontlyReportComponent } from './montly-report/montly-report.component';



@Component({
  selector: 'app-montly',
  templateUrl: './montly.component.html',
  styleUrls: ['./montly.component.css']
})
export class MontlyComponent implements OnInit {
  lastSearch: any;
  configSearch: any = [];
  areas = [];
  scopes = [];
  rows = [];
  groups = [];
  months = months
  preDataReport: any;

  currentUser: any;
  profile = profile;
  roles = roles;
  syncInit = false;

  columns = [
    { Propriedade: 'area_name', Titulo: 'Sistema de Gestão', Visivel: true, Largura: 70 },
    { Propriedade: 'area_aspect_name', Titulo: 'Aspecto', Visivel: true, Largura: 70 },
    { Propriedade: 'document_type', Titulo: 'Tipo', Visivel: true, Largura: 20 },
    { Propriedade: 'document_number', Titulo: 'Número', Visivel: true, Largura: 30 },
    { Propriedade: 'document_date', Titulo: 'Data', Visivel: true, Largura: 50 },
    { Propriedade: 'status_description', Titulo: 'Status', Visivel: true, Largura: 50 },
    { Propriedade: 'document_summary', Titulo: 'Ementa', Visivel: true, Largura: 200 },
  ]

  constructor(
    private crud: CRUDService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private auth: AuthGuard,    
  ) { }

  prepareScreen() {
    this.getDocumentScopes();
    this.getAreas();

    this.setConfigSearch();
  }

  onFilterValueChange(type: string, value: any) {
    if (type === 'customer_group_id') {
      this.getCustomers(value);
    }
    if (type === 'customer_id') {
      this.getSearchUnits(value);
    }
  }

  async setConfigSearch() {    

    let groups = await this.getGroups();

    let aux = [      
      new CampoBusca("customer_group_id", "Grupo", 50, "", "LIST", groups, "customer_group_name", "customer_group_id"),
      new CampoBusca("customer_id", "Matriz", 50, "", "LIST", [], "customer_business_name", "customer_id"),
      new CampoBusca("customer_unit_id", "Unidade", 50, "", "LIST", [], "customer_unit_name", "customer_unit_id"),
      new CampoBusca("month", "Mês", 50, "", "LIST", months, "name", "month"),
      new CampoBusca("year", "Ano", 50, "", "string", null, null, null),
    ];

    if (this.currentUser.role !== roles.admin) {
      aux[0].disabled = true; //group
      aux[1].fieldValue = this.currentUser.customer_id; 
    }

    this.configSearch = aux;
    this.syncInit = true;
  }


  async showReport() {
  
    let title = "Relatório Mensal";
    
    let dialogRef: MatDialogRef<any> = this.dialog.open(MontlyReportComponent, {
      width: dialog.large,
      disableClose: false,
      data: {
        title: title,
        customer_name: this.configSearch[1].lista[0].customer_business_name,
        unit_name: this.configSearch[2].lista[0].customer_unit_name,
        date_report: new Date().toLocaleDateString('pt-Br', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        payload: { rows: this.rows, areas: this.areas, scopes: this.scopes },
        new: false
      }
    });

    dialogRef.afterClosed()
    .subscribe(res => {      
      console.log('Fechou')
      return;
    });
  }


  getDocumentScopes() {
    this.crud.GetParams(undefined, "/documentscope").subscribe(res => {
      if (res.status == 200) {
        this.scopes = [];
        this.scopes = res.body;
      }
    });
  }

  getAreas() {
    this.crud.GetParams(undefined, "/area").subscribe(res => {
      if (res.status == 200) {
        this.areas = [];
        this.areas = res.body;
      }
    });
  }


  //#region GROUP CUSTOMER UNIT

  getGroups() {
    return this.crud.GetParams({ "orderby": "customer_group_name", "direction": "asc" }, "/customergroup").toPromise().then(res => res.body);
  }
  getCustomers(group_id) {        
    if (group_id) {
      let p: any = new Object();
      p.orderby = "customer_business_name";
      p.direction = "asc";
      p.fields = "customer_group_id";
      p.ops = "eq";
      p.values = group_id;
      this.crud.GetParams(p, "/customer/query").subscribe(res => {
        let customers = res.body;
        this.configSearch[1].lista = customers;        
        this.syncInit = true;
      });
    } else {
      let p: any = new Object();
      p.orderby = "customer_business_name";
      p.direction = "asc";
      p.field = "customer_group_id"
      
      this.crud.GetParams(p, "/customer").subscribe(res => {
        let customers = res.body;
        this.configSearch[1].lista = customers;        
        this.syncInit = true;
      });
    }
  }
  getSearchUnits(customer_id) {
    if (customer_id) {
      let p: any = new Object();
      p.orderby = "customer_unit_name";
      p.direction = "asc";
      p.fields = "customer_id";
      p.ops = "eq";
      p.values = customer_id;
      this.crud.GetParams(p, "/customerunit/query").subscribe(res => {
        let units = res.body;
        this.configSearch[2].lista = units;        
        this.syncInit = true;
      });
    } else {
      let p: any = new Object();
      p.orderby = "customer_unit_name";
      p.direction = "asc";
      p.field = "customer_id"
      
      this.crud.GetParams(p, "/customerunit").subscribe(res => {
        let units = res.body;
        this.configSearch[2].lista = units;        
        this.syncInit = true;
      });
    }
  }


//#endregion
  
  //{{url}}/api/v1/reports/montly_applicable_report?year=1989&month=7&customer_unit_id=1
  getData(parameter: any) {
  
    if (this.currentUser.role !== roles.admin) {
      parameter = {
        customer_id: this.currentUser.customer_id
      }
    }
    this.lastSearch = parameter;
    this.crud.GetParams(parameter, "/reports/montly_applicable_report").subscribe(res => {
      this.rows = [];
      this.rows = res.body;
    });

    this.getDocumentScopes();
    this.getAreas();
  }
  
  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.prepareScreen();
  }
}
