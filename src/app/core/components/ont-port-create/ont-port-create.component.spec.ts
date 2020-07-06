import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OntPortCreateComponent } from './ont-port-create.component';

describe('OntPortCreateComponent', () => {
  let component: OntPortCreateComponent;
  let fixture: ComponentFixture<OntPortCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OntPortCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OntPortCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
