import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgmtPortComponent } from './mgmt-port.component';

describe('MgmtPortComponent', () => {
  let component: MgmtPortComponent;
  let fixture: ComponentFixture<MgmtPortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgmtPortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgmtPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
