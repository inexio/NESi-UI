import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OntVisualComponent } from './ont-visual.component';

describe('OntVisualComponent', () => {
  let component: OntVisualComponent;
  let fixture: ComponentFixture<OntVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OntVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OntVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
