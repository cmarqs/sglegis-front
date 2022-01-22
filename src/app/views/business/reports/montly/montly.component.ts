import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { profile } from 'app/models/auth/profile.types';
import { roles } from 'app/models/auth/roles';
import { CampoBusca } from 'app/models/base/negocio/CampoBusca';
import { dialog } from 'app/models/size/size';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';

@Component({
  selector: 'app-montly',
  templateUrl: './montly.component.html',
  styleUrls: ['./montly.component.css']
})
export class MontlyComponent implements OnInit {
  lastSearch: any;
  configSearch: any = [];
  rows = [];
  groups = [];
  currentUser: any;
  profile = profile;
  roles = roles;
  syncInit = false;

  
  columns = [
    { Propriedade: 'customer_business_name', Titulo: 'Matriz', Visivel: true, Largura: 70 },
    { Propriedade: 'customer_unit_name', Titulo: 'Unidade', Visivel: true, Largura: 100 },
    { Propriedade: 'customer_unit_address', Titulo: 'Endereço', Visivel: true, Largura: 70 },
    { Propriedade: 'unit_contact_name', Titulo: 'Nome do Contato', Visivel: true, Largura: 70 },
    { Propriedade: 'unit_contact_email', Titulo: 'Email', Visivel: true, Largura: 100 },
    { Propriedade: 'unit_contact_phone', Titulo: 'Telefone', Visivel: true, Largura: 50 }
  ]

  constructor(
    private crud: CRUDService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private auth: AuthGuard,    
  ) { }

  prepareScreen() {
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
    ];

    if (this.currentUser.role !== roles.admin) {
      aux[0].disabled = true; //group
      aux[1].fieldValue = this.currentUser.customer_id; 
    }

    this.configSearch = aux;
    this.syncInit = true;
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

  getunits(parameter: any) {
    if (this.currentUser.role !== roles.admin) {
      parameter = {
        customer_id: this.currentUser.customer_id
      }
    }
    this.lastSearch = parameter;
    this.crud.GetParams(parameter, "/customerunit").subscribe(res => {
      this.rows = [];
      this.rows = res.body;
    })
  }
//#endregion
  
  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.prepareScreen();
  }
}
