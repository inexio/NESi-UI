import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubrackCreateComponent } from './subrack-create.component';

describe('SubrackCreateComponent', () => {
  let component: SubrackCreateComponent;
  let fixture: ComponentFixture<SubrackCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubrackCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubrackCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
