import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgmtCardVisualComponent } from './mgmt-card-visual.component';

describe('MgmtCardVisualComponent', () => {
  let component: MgmtCardVisualComponent;
  let fixture: ComponentFixture<MgmtCardVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgmtCardVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgmtCardVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
