import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { profile } from 'app/models/auth/profile.types';
import { roles } from 'app/models/auth/roles';
import { CampoBusca } from 'app/models/base/negocio/CampoBusca';
import { dialog } from 'app/models/size/size';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';
import { UsersFormComponent } from './users-form/users-form.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  lastSearch: any;
  rows = [];

  columns = [
    {
      Propriedade: 'user_id',
      Titulo: 'Id',
      Visivel: false,
      Largura: 20
    },
    {
      Propriedade: 'user_name',
      Titulo: 'Name',
      Visivel: true,
      Largura: 50
    },    
    {
      Propriedade: 'user_email',
      Titulo: 'Email',
      Visivel: true,
    },
    {
      Propriedade: 'user_role',
      Titulo: 'Tipo Acesso',
      Visivel: true,
      Largura: 50
    },  
    {
      Propriedade: 'user_profile_type',
      Titulo: 'Perfil',
      Visivel: true,
      Largura: 50
    },
    {
      Propriedade: 'customer_business_name',
      Titulo: 'Nome do Cliente',
      Visivel: true,
      Largura: 150
    },
    {
      Propriedade: 'is_disabled',
      Titulo: 'Status',
      Visivel: true,
      Largura: 50,
      Render: (value) => value == 1 ? "Desabilitado" : "Ativo"
    },
  ];

  configSearch = [
    new CampoBusca("user_name", "Usuário", 50, "", "string", null, null, null)
  ]

  currentUser: any = {};
  roles = roles;
  profile = profile;


  constructor(
    private crud: CRUDService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private auth: AuthGuard
  ) { }

  prepareScreen() {
    this.currentUser = this.auth.getUser();
    
    if (this.currentUser.role === roles.admin) {
      this.getUsers(undefined);
    } else {
      this.getUsersByCustomer(this.currentUser.customer_id);
    }
  }
  
  openForm(info: any = {}, newRecord: Boolean) {    
    let text;
    text = (newRecord) ? "Novo Usuário" : "Editar Usuário: " + info.user_name;
    
    let dialogRef: MatDialogRef<any> = this.dialog.open(UsersFormComponent, {
      width: dialog.small,
      disableClose: true,
      data: { title: text, payload: info, new: newRecord }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (this.currentUser.role === roles.admin) {
        this.getUsers(undefined);
      } else {
        this.getUsersByCustomer(this.currentUser.customer_id);
      }      
      return;
    })
  }

  getUsers(parameter: any) {    
    this.lastSearch = parameter;
    this.crud.GetParams(this.lastSearch, "/users").subscribe(res => {
      this.rows = [];
      this.rows = res.body;             
    })
  }

  getUsersByCustomer(customer_id) {
    let p: any = new Object();
    p.orderby = "user_name";
    p.direction = "asc";
    p.fields = "customer_id";
    p.ops = "eq";
    p.values = customer_id;
    this.crud.GetParams(p, "/users/query").subscribe(res => {
      this.rows = [];
      this.rows = res.body;
    });
  }

  ngOnInit() {
    this.prepareScreen();
  }

}
