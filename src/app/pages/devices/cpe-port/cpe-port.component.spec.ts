import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpePortComponent } from './cpe-port.component';

describe('CpePortComponent', () => {
  let component: CpePortComponent;
  let fixture: ComponentFixture<CpePortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpePortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpePortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
