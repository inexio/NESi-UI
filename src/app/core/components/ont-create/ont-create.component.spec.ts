import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OntCreateComponent } from './ont-create.component';

describe('OntCreateComponent', () => {
  let component: OntCreateComponent;
  let fixture: ComponentFixture<OntCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OntCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OntCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
