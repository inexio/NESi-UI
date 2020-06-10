import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OntComponent } from './ont.component';

describe('OntComponent', () => {
  let component: OntComponent;
  let fixture: ComponentFixture<OntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
