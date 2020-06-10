import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OntPortComponent } from './ont-port.component';

describe('OntPortComponent', () => {
  let component: OntPortComponent;
  let fixture: ComponentFixture<OntPortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OntPortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OntPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
