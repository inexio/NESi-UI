import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubrackVisualComponent } from './subrack-visual.component';

describe('SubrackVisualComponent', () => {
  let component: SubrackVisualComponent;
  let fixture: ComponentFixture<SubrackVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubrackVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubrackVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
