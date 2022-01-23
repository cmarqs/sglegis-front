import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { profile } from 'app/models/auth/profile.types';
import { CampoBusca } from 'app/models/base/negocio/CampoBusca';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';
import { FormGroup, FormControl } from '@angular/forms';
import { Coluna } from '../../../models/base/Coluna';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @Output() PesquisarRegistro: EventEmitter<any> = new EventEmitter();
  @Input() CamposBusca: Array<CampoBusca>;
  @Input() MostrarBarraBusca: boolean = true;
  @Input() initFilterOpened: boolean = false;
  @Output() filterValueChange: EventEmitter<any> = new EventEmitter();
  @Input() Colunas: Array<Coluna>;

  rows = [];
  lastSearch: any;
  currentUser: any = {};
  profile = profile;
  AuxColunas = [];
  buscarForm: FormGroup;
  public finderPanel: boolean = false;
  @ViewChild('buscadorForm') public buscadorForm: ElementRef;
  @ViewChild('txtFinder') public txtFinder: ElementRef;
  public formReady: boolean = false;
  public showFilter: boolean = false;

  constructor(
    private crud: CRUDService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,    
    private auth: AuthGuard
  ) { }

  configSearch = [
    new CampoBusca("filter", "Grupo", 50, "", "string", null, null, null)
  ];

  prepareScreen() {
    
    
  }

  getCustomers(parameter: any) {
    this.lastSearch = parameter;
    this.crud.GetParams(this.lastSearch, "/customer").subscribe(res => {
      this.rows = [];
      this.rows = res.body;
    })
  }

  Pesquisar() {
    const formulario = this.buscarForm.value;
    //console.log(formulario);
    
    this.finderPanel = false;    
    this.showFilter = this.showFilters();
    this.setFinderValue();
    this.PesquisarRegistro.emit({ parametro: formulario });    
  }

  showFilters() {
    let ret = false;
    Object.keys(this.buscarForm.controls).forEach(field => {
      let control = this.buscarForm.get(field);
      if (control.value) {
        ret = true;
      }
    });
    return ret;
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.buscadorForm.nativeElement.contains(event.target)) {
      if (!this.txtFinder.nativeElement.contains(event.target)) {       
          //this.finderPanel = false;
      }
    }
  }

  setFinderValue() {    
    for (let i = 0; i < this.CamposBusca.length; i++){
      this.CamposBusca[i].value = this.buscarForm.controls[this.CamposBusca[i].nomeCampo].value;
    }
  }

  showFinderToggle() {
    this.finderPanel = !this.finderPanel;
  }

  clear() {
    this.buscarForm.reset();
    for (var name in this.buscarForm.controls) {
      this.buscarForm.controls[name].setValue("");
    }
    
  }

  closeFinder() {
    this.finderPanel = false;
  }

  getValue(field) {
    if (!field || !field.value)
      return;
    if (field.tipoCampo == "LIST")
      return field.lista.find(p => p[field.nomeCampo] == field.value)[field.fieldText]
    else
      return field.value;
  }

  ngOnInit() {    

  }

}
