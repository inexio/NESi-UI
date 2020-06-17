import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OntPortVisualComponent } from './ont-port-visual.component';

describe('OntPortVisualComponent', () => {
  let component: OntPortVisualComponent;
  let fixture: ComponentFixture<OntPortVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OntPortVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OntPortVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
