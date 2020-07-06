import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpePortCreateComponent } from './cpe-port-create.component';

describe('CpePortCreateComponent', () => {
  let component: CpePortCreateComponent;
  let fixture: ComponentFixture<CpePortCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpePortCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpePortCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
