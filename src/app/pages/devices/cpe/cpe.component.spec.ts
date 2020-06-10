import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpeComponent } from './cpe.component';

describe('CpeComponent', () => {
  let component: CpeComponent;
  let fixture: ComponentFixture<CpeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
