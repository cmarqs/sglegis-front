import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { profile } from 'app/models/auth/profile.types';
import { roles } from 'app/models/auth/roles';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AreasComponent } from './areas/areas.component';
import { AspectsComponent } from './aspects/aspects.component';
import { CustomerGroupsComponent } from './customer-groups/customer-groups.component';
import { CustomersFormsComponent } from './customers/customers-forms/customers-forms.component';
import { CustomersComponent } from './customers/customers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentsComponent } from './documents/documents.component';
import { HomeComponent } from './home/home.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { unitsComponent } from './units/units.component';
import { UsersComponent } from './users/users.component';
 
const routes: Routes = [  
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [{
      path: 'dashboard',
      component: DashboardComponent,
      data: { title: 'Dashboard', breadcrumb: 'Dashboard' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'home',
      component: HomeComponent,
      data: { title: 'Bem vindo', breadcrumb: 'Bem vindo' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'grupos',
      component: CustomerGroupsComponent,
      data: { title: 'Grupos de Clientes', breadcrumb: 'Grupos de Clientes', roles: [roles.admin], profiles: [profile.gestor] }
    }]
  },
  {
    path: '',
    children: [{
      path: 'clientes',
      component: CustomersComponent,
      data: { title: 'Clientes', breadcrumb: 'Clientes', roles: [roles.admin], profiles: [profile.gestor] }
    }]
  },
  {
    path: '',
    children: [{
      path: 'unidades',
      component: unitsComponent,
      data: { title: 'Unidades', breadcrumb: 'Unidades', profiles: [profile.gestor] }
    }]
  },
  {
    path: '',
    children: [{
      path: 'areas',
      component: AreasComponent,
      data: { title: 'Sistemas de Gestão', breadcrumb: 'Sistemas de Gestão', profiles: [profile.gestor] }
    }]
  },
  {
    path: '',
    children: [{
      path: 'aspectos',
      component: AspectsComponent,
      data: { title: 'Aspectos', breadcrumb: 'Aspectos', profiles: [profile.gestor] }
    }]
  },
  {
    path: '',
    children: [{
      path: 'documentos',
      component: DocumentsComponent,
      data: { title: 'Requisitos Legais', breadcrumb: 'Requisitos Legais', profiles: [profile.gestor] }
    }]
  },
  {
    path: '',
    children: [{
      path: 'users',
      component: UsersComponent,
      data: { title: 'Users', breadcrumb: 'Users', profiles: [profile.gestor] }
    }]
  },
  {
    path: '',
    children: [{
      path: 'audit',
      component: RequirementsComponent,
      data: { title: 'Acompanhamento de Conformidade Legal', breadcrumb: 'Conformidade Legal' }
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
