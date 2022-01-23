import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MontlyComponent } from './montly.component';

describe('MontlyComponent', () => {
  let component: MontlyComponent;
  let fixture: ComponentFixture<MontlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MontlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MontlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
