import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortCreateComponent } from './port-create.component';

describe('PortCreateComponent', () => {
  let component: PortCreateComponent;
  let fixture: ComponentFixture<PortCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
