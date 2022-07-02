import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { Coluna } from '../../../models/base/Coluna';
import { FormGroup, FormControl } from '@angular/forms';
import { ExportToCsv } from 'export-to-csv';
import { MatDialogRef, MatDialog, MatOption } from '@angular/material';
import { PopupImagemComponent } from '../popup-imagem/popup-imagem.component';
import { AppInformationService } from '../../../../app/services/dialogs/app-information/app-information.service';
import { CampoBusca } from 'app/models/base/negocio/CampoBusca';
import { AttachmentsDownloadComponent } from 'app/views/business/requirements/attachments-download/attachments-download.component';
import * as XLSX from 'xlsx';
import { ExcelService } from 'app/services/negocio/FileService/ExcelService';


@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent implements OnInit {
  @Input() Colunas: Array<Coluna>;
  @Input() BtnResponsible: Boolean;
  @Input() BtnAttachment: Boolean = false;
  @Input() BtnAction: Boolean;
  @Input() BtnEditar: Boolean;
  @Input() BtnDeletar: Boolean;
  @Input() Linhas: Array<any> = [];
  @Input() CamposBusca: Array<CampoBusca>;
  @Input() BtnIncluir: Boolean;
  @Input() viewOnly: Boolean = false;
  @Input() check: Boolean = false;
  @Input() CheckedRows: Array<any> = [];
  @Input() MostrarBarraBusca: boolean = true;
  @Input() Expansible: boolean = false;
  @Input() PropertyToExpanse: String;
  @Input() actionButton: boolean = false;
  @Input() ActionButtonStatus: boolean = false;
  @Input() actionButtonCaption: String;
  @Input() syncOnInit: boolean = false;
  @Input() initFilterOpened: boolean = false;
  @Output() actionButtonEvent: EventEmitter<any> = new EventEmitter();
  @Output() PesquisarRegistro: EventEmitter<any> = new EventEmitter();
  @Output() IncluirRegistro: EventEmitter<any> = new EventEmitter();
  @Output() EditarRegistro: EventEmitter<any> = new EventEmitter();
  @Output() ExcluirRegistro: EventEmitter<any> = new EventEmitter();
  @Output() ResponsibleRegistro: EventEmitter<any> = new EventEmitter();
  @Output() ActionRegistro: EventEmitter<any> = new EventEmitter();
  @Output() AttachementRegistro: EventEmitter<any> = new EventEmitter();
  @Output() CheckRegistro: EventEmitter<any> = new EventEmitter();
  @Output() filterValueChange: EventEmitter<any> = new EventEmitter();

  AuxColunas = [];
  buscarForm: FormGroup;
  public finderPanel: boolean = false;
  @ViewChild('buscadorForm') public buscadorForm: ElementRef;
  @ViewChild('txtFinder') public txtFinder: ElementRef;
  @ViewChild('myTable') table: any;
  @ViewChild('stickyMenu') menuElement: ElementRef;

  public formReady: boolean = false;
  public showFilter: boolean = false;

  sticky: boolean = false;
  elementPosition: any;


  constructor(public dialog: MatDialog,
    private mensagem: AppInformationService,
    private eRef: ElementRef) { }

  ngAfterViewInit() {
    if (this.menuElement)
      this.elementPosition = this.menuElement.nativeElement.offsetTop;
    }

  ngOnInit() {    
    this.finderPanel = this.initFilterOpened;
    if (this.BtnIncluir == undefined) {
      this.BtnIncluir = true;
    }    
    this.prepareScreen();
  }

  prepareScreen() {
    this.buscarForm = new FormGroup({});    

    for (let i = 0; i < this.CamposBusca.length; i++) {
      //console.log(`${this.CamposBusca[i].fieldText}: ${this.CamposBusca[i].fieldValue}`);
      
      this.buscarForm.addControl(this.CamposBusca[i].nomeCampo, new FormControl(
        this.CamposBusca[i].tipoCampo === "LIST" && this.CamposBusca[i].fieldValue === this.CamposBusca[i].nomeCampo ? "" : this.CamposBusca[i].fieldValue
      ));
      this.buscarForm.controls[this.CamposBusca[i].nomeCampo].valueChanges.subscribe(res => {
        this.filterValueChange.emit({
          type: this.CamposBusca[i].nomeCampo,
          value: res
        })
      })
    }
    this.AuxColunas = Object.assign([], this.Colunas.filter(c=> c.Visivel === true));
    this.formReady = true;
  }

  ngDoCheck() {
    if (this.syncOnInit) {
      this.prepareScreen();
      this.syncOnInit = false;      
    }
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

  // ngAfterViewChecked() { window.dispatchEvent(new Event('resize')) }

  @HostListener('document:wheel', ['$event.target']) onScroll(): void {
    const windowScroll = 150;
    let scrollPosition = document.querySelector('.mat-drawer-content.mat-sidenav-content').scrollTop;
    //console.log(`Scrolling window: ${windowScroll} - position: ${scrollPosition}`);
    
      if(scrollPosition >= windowScroll){
        this.sticky = true;
      } else {
        this.sticky = false;
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.buscadorForm.nativeElement.contains(event.target)) {
      if (!this.txtFinder.nativeElement.contains(event.target)) {       
          //this.finderPanel = false;
      }
    }
  }

  actionButtonClick() {
    this.actionButtonEvent.emit();
  }

  Incluir() {
    this.IncluirRegistro.emit({ registro: null, novo: true });
  }

  Editar(registro: any) {
    this.EditarRegistro.emit({ registro: registro, novo: false });
  }

  Excluir(registro: any) {
    this.ExcluirRegistro.emit({ registro: registro, novo: false });
  }

  onResponsible(registro) {
    this.ResponsibleRegistro.emit({ registro: registro });
  }

  onAction(registro) {
    this.ActionRegistro.emit({ registro: registro });
  }

  onAttachment(registro) {
    this.AttachementRegistro.emit({ registro: registro });
  }

  onCheck(registro: any, event) {    
    this.CheckRegistro.emit({ registro: registro, status: event.checked })
  }

  isCheckedRow(rowId: any) {
    const f = (r) => {
      if (r.item_area_aspect_id == rowId)
        return r;
    }

    var reg = this.CheckedRows.find(r => f(r));
    return reg;
  }


  Pesquisar() {
    const formulario = this.buscarForm.value;
    //console.log(formulario);
    
    this.finderPanel = false;    
    this.showFilter = this.showFilters();
    this.setFinderValue();
    this.PesquisarRegistro.emit({ parametro: formulario });    
  }

  setFinderValue() {    
    for (let i = 0; i < this.CamposBusca.length; i++){
      this.CamposBusca[i].value = this.buscarForm.controls[this.CamposBusca[i].nomeCampo].value;
    }
  }

  Alternar(col) {
    col.Visivel = !col.Visivel;
    this.AuxColunas = this.Colunas.filter(c => {
      return c.Visivel === true;
    });
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }


  Exportar() {
    let data = [];
    this.Linhas.map(l => {
      let obj = {};

      this.Colunas.map(c => {
        let d = '';
        if (l[c.Propriedade])
          d = l[c.Propriedade];
        obj[c.Titulo] = d;
      });

      data.push(obj);
    });
    
    const options = {
      fieldSeparator: ';',
      quoteStrings: "",
      decimalseparator: ',',
      showLabels: true,
      showTitle: false,
      title: 'Relatiorio CSV',
      useBom: true,
      useKeysAsHeaders: true
    };

    const exportToExcel = new ExcelService();
    exportToExcel.exportAsExcelFile(data, 'RELATORIO');

    // const exportToCsv = new ExportToCsv(options);
    // exportToCsv.generateCsv(data, false);
  };


  openPopup(imagem: string) {
    if ((imagem === undefined) || (imagem === "")) {
      this.mensagem.information("Informações", "Não foi feito registro fotográfico.");
    } else {
      let dialogRef: MatDialogRef<any> = this.dialog.open(AttachmentsDownloadComponent, {
        width: '95%;',
        disableClose: true,
        data: { title: "Imagem", payload: imagem }
      });

      dialogRef.afterClosed()
        .subscribe(() => { });
    }
  }

  showFinderToggle() {
    //this.buscarForm.reset();
    // for (var name in this.buscarForm.controls) {
    //   this.buscarForm.controls[name].setValue("");
    // }
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
    if (field.tipoCampo == "data")
      return;
    else
      return field.value;
  }

}
