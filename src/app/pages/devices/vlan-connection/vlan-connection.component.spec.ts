import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VlanConnectionComponent } from './vlan-connection.component';

describe('VlanConnectionComponent', () => {
  let component: VlanConnectionComponent;
  let fixture: ComponentFixture<VlanConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VlanConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VlanConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
