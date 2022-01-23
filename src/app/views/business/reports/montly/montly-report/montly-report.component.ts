import { Component, Inject, OnInit } from '@angular/core';
import { profile } from 'app/models/auth/profile.types';
import { roles } from 'app/models/auth/roles';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { asBlob } from 'html-docx-js-typescript'
// if you want to save the docx file, you need import 'file-saver'
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-montly-report',
  templateUrl: './montly-report.component.html',
  styleUrls: ['./montly-report.component.css']
})
export class MontlyReportComponent implements OnInit {
  currentUser: any;
  roles = roles;
  profile = profile;
  dataReport: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auth: AuthGuard
  ) { }

  prepareScreen(data) {
    let areas = data.payload.areas;
    let scopes = data.payload.scopes;
    let dados = data.payload.rows;
    let obj = { tableData: [] };

    for (let s = 0; s < scopes.length; s++) {
      const scope = scopes[s];
      obj.tableData.push({ scope: scope, areas: [] });

      for (let a = 0; a < areas.length; a++) {
        let japassou: boolean = false;

        const area = areas[a];
        obj.tableData[s].areas.push({ area_name: area.area_name, data: [] });
        
        for (let d = 0; d < dados.length; d++) {
          const dado = dados[d];

          if (dado.area_id == area.area_id && dado.document_scope_id == scope.document_scope_id){
            
            obj.tableData[s].areas[a].data.push({
              document_type: dado.document_type,
              document_number: dado.document_number,
              document_date: dado.document_date,
              status_description: dado.status_description,
              document_summary: dado.document_summary
            });
          }
          else {
            if (!japassou) {
              obj.tableData[s].areas[a].data.push({ empty: "Não houve alteração no período" });
            }
          }

          japassou = true;
        }
      }
    }
      
    obj["aux"] = { title: data.title, customer_name: data.customer_name, unit_name: data.unit_name, date_report: data.date_report };
    this.dataReport = obj;
  }
  

  generatePdf() {
    let htmlString = document.querySelector('.custom').innerHTML
    
      asBlob(htmlString).then(data => {
        saveAs(data, 'Relatorio_Mensal.docx') // save as docx file
      }) // asBlob() return Promise<Blob|Buffer>
  }

  getKeyByValue(obj, value) {
    let keys = Object.keys(obj).filter(k => obj[k] === value);
    return keys;
  }


  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.prepareScreen(this.data);
  }

}
