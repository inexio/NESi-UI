import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgmtPortVisualComponent } from './mgmt-port-visual.component';

describe('MgmtPortVisualComponent', () => {
  let component: MgmtPortVisualComponent;
  let fixture: ComponentFixture<MgmtPortVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgmtPortVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgmtPortVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
