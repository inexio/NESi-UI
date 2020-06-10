import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VlanComponent } from './vlan.component';

describe('VlanComponent', () => {
  let component: VlanComponent;
  let fixture: ComponentFixture<VlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
