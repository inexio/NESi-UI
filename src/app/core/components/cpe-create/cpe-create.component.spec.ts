import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpeCreateComponent } from './cpe-create.component';

describe('CpeCreateComponent', () => {
  let component: CpeCreateComponent;
  let fixture: ComponentFixture<CpeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
