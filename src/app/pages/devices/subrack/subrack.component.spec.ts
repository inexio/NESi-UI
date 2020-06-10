import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubrackComponent } from './subrack.component';

describe('SubrackComponent', () => {
  let component: SubrackComponent;
  let fixture: ComponentFixture<SubrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
