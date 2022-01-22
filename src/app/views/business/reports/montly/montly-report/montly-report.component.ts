import { Component, Inject, OnInit } from '@angular/core';
import { profile } from 'app/models/auth/profile.types';
import { roles } from 'app/models/auth/roles';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';

@Component({
  selector: 'app-montly-report',
  templateUrl: './montly-report.component.html',
  styleUrls: ['./montly-report.component.css']
})
export class MontlyReportComponent implements OnInit {
  currentUser: any;
  roles = roles;
  profile = profile;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auth: AuthGuard
  ) { }

  prepareScreen(data) {
    
  }

  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.prepareScreen(this.data);
  }

}
