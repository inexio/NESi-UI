import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardVisualComponent } from './card-visual.component';

describe('CardVisualComponent', () => {
  let component: CardVisualComponent;
  let fixture: ComponentFixture<CardVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
