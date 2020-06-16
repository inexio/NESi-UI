import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortVisualComponent } from './port-visual.component';

describe('PortVisualComponent', () => {
  let component: PortVisualComponent;
  let fixture: ComponentFixture<PortVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
