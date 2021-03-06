import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { profile } from 'app/models/auth/profile.types';
import { roles } from 'app/models/auth/roles';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AppConfirmService } from 'app/services/dialogs/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';

@Component({
	selector: 'app-units-responsible-form',
	templateUrl: './units-responsible-form.component.html',
	styleUrls: ['./units-responsible-form.component.css']
})
export class unitsResponsibleFormComponent implements OnInit {
	public responsibleForm: FormGroup;
	selectedAspects = [];
	aspectInvalid = true;
	aspects = [];
	areasWithAspects = [];
	responsibles = [];
	deletedResponsibles = [];

	public editmode:boolean = false;
	editValue = [];
	customer_unit_id = 0;

	currentUser: any;
	profile = profile;
	roles = roles;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<unitsResponsibleFormComponent>,
		private loader: AppLoaderService,
		private crudService: CRUDService,
		private snackBar: MatSnackBar,
		private confirm: AppConfirmService,
		private auth: AuthGuard,
	) { }

	ngOnInit() {
		this.currentUser = this.auth.getUser();
		this.prepareScreen(this.data.payload);
	}

	ngDoCheck() {
		this
	}

	prepareScreen(record) {
		this.editmode = false;

		this.responsibleForm = new FormGroup({
			unit_aspect_responsible_name: new FormControl('', [Validators.required]),
			unit_aspect_responsible_email: new FormControl('', [Validators.required, Validators.email]),
		});

		this.getAreasWithAspects(record.customer_unit_id);
		this.getResponsiblesAspects(record.customer_unit_id);
	}

	prepareScreenEdit(record) {
		this.editmode = true;

		this.responsibleForm = new FormGroup({
			unit_aspect_responsible_name: new FormControl(record.unit_aspect_responsible_name, [Validators.required]),
			unit_aspect_responsible_email: new FormControl(record.unit_aspect_responsible_email, [Validators.required, Validators.email]),
		});
		this.responsibles = [...this.responsibles];
		if (this.areasWithAspects && this.areasWithAspects.length > 0) {

			this.areasWithAspects.forEach(area => {
				area.aspects.forEach(aspect => {
					var aspectChecked = record.aspects.find(e => e.area_aspect_id === aspect.area_aspect_id);
					if (aspectChecked) {
						aspect.checked = 'S';
						this.selectedAspects.push(aspect);
					}
				});
			});
		}
	}

	getAreasWithAspects(unit_id) {
		this.crudService.GetParams(undefined, `/customerunit/${unit_id || "0"}/aspectsonly`).subscribe(res => {
			if (res.status == 200) {
				this.areasWithAspects = [];
				this.areasWithAspects = res.body;
			}
		});
	}

	getResponsiblesAspects(unit_id) {
		this.crudService.GetParams(undefined, `/customerunit/${unit_id || 0}/responsibles`).subscribe(res => {
			if (res.status == 200) {
				this.responsibles = [];
				this.responsibles = res.body.map(responsible => {
					return {
						...responsible,
						tooltip: responsible.aspects.map(as => `${as.area_aspect_name}`).join(", "),
					}
				});
			}
		})
	}

	unToggleAll() {
		this.areasWithAspects.forEach(area => {
			for (let i = 0; i < area.aspects.length; i++) {
				this.toggle(area.aspects[i], { checked: false });
			}
		});
	};

	toggleAll(arearWithAspect, evento) {
		for (let i = 0; i < arearWithAspect.aspects.length; i++) {
			this.toggle(arearWithAspect.aspects[i], evento);
		}
	}

	toggle(aspect, evento) {
		aspect.checked = (evento.checked) ? "S" : "N";
		this.toggleAspect(aspect, evento);
	}

	addResponsible() {
		let newResponsible = this.responsibleForm.value;
		this.responsibles = [...this.responsibles, {
			unit_aspect_responsible_id: this.responsibles.length + 1,
			...newResponsible,
			aspects: [
				...this.selectedAspects
			],
			tooltip: this.selectedAspects.map(aspect => aspect.area_aspect_name).join(', '),
			isNew: true
		}];
		this.editmode = false;

		this.responsibleForm = new FormGroup({
			unit_aspect_responsible_name: new FormControl('', [Validators.required]),
			unit_aspect_responsible_email: new FormControl('', [Validators.required, Validators.email]),
		});
		// this.responsibleForm.reset();
		// this.unToggleAll();
		// this.selectedAspects = [];
		// this.aspectInvalid = true;
	}

	removeResponsible(info: any) {
		this.responsibles = this.responsibles.filter(res => res.unit_aspect_responsible_id !== info.unit_aspect_responsible_id);
		if (!info.isNew) {
			this.deletedResponsibles.push(info.unit_aspect_responsible_id);
		}
	}

	cancelEdit() {

		function removeItemOnce(arr, value) {
			var index = arr.indexOf(value);
			if (index > -1) {
			  arr.splice(index, 1);
			}
			return arr;
		  }
		  
		if (this.editmode && this.editValue) {

			this.responsibles = [...this.responsibles, this.editValue ];
			removeItemOnce(this.deletedResponsibles, this.editValue["unit_aspect_responsible_id"]);
			this.editValue = [];
			this.editmode = false;

		}
		this.responsibleForm.reset();
		this.unToggleAll();
		this.selectedAspects = [];
		this.aspectInvalid = true;
	}

	editResponsible(info: any) {
		this.editValue = info;
		this.removeResponsible(info);
		this.prepareScreenEdit(info);
	}

  

	isCheckedAspect(info: any) {
		return this.selectedAspects.find(aspect => aspect.area_aspect_id === info.area_aspect_id);
	}
	toggleAspect(info: any = {}, ev: any) {
		if (ev.checked) {
			this.selectedAspects = [...this.selectedAspects, info];
		} else {
			this.selectedAspects = this.selectedAspects.filter(aspect => aspect.area_aspect_id !== info.area_aspect_id);
		}
		if (this.selectedAspects.length === 0) this.aspectInvalid = true;
		else this.aspectInvalid = false;
	}
  
	save() {
		this.loader.open();
		try {
			this.saveResponsible(this.data.payload.customer_unit_id).then(async () => {
				await this.deleteResponsibles();
				this.loader.close();
				this.snackBar.open("Respons??veis gravados com sucesso", "", { duration: 3000 });
				this.dialogRef.close();
			})
		} catch (error) {
			this.loader.close();
			this.snackBar.open("Erro ao gravar respons??veis: " + error, "", { duration: 5000 })
		}
	}

	async deleteResponsibles() {
		for (let i = 0; i < this.deletedResponsibles.length; i++) {
			await this.crudService.DeleteParams(this.deletedResponsibles[i], '/customerunit/responsibles').toPromise();
		}
	}

	async saveResponsible(customer_unit_id) {
		for (let i = 0; i < this.responsibles.length; i++) {
			if (this.responsibles[i].isNew) {
				const newResponsible = {
					customer_unit_id,
					unit_aspect_responsible_name: this.responsibles[i].unit_aspect_responsible_name,
					unit_aspect_responsible_email: this.responsibles[i].unit_aspect_responsible_email
				}
				const resResponsible = await this.crudService.Save(newResponsible, true, `/customerunit/responsibles`, null).toPromise();
				const { unit_aspect_responsible_id } = resResponsible.body;
        
				for (let j = 0; j < this.responsibles[i].aspects.length; j++) {
					const newResAspect = {
						area_aspect_id: this.responsibles[i].aspects[j].area_aspect_id,
						unit_aspect_responsible_id
					}
					await this.crudService.Save(newResAspect, true, '/customerunit/responsibleaspects', null).toPromise();
				}
			}
		}
	}
}