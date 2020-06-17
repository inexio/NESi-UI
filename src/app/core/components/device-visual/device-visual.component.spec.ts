import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceVisualComponent } from './device-visual.component';

describe('DeviceVisualComponent', () => {
  let component: DeviceVisualComponent;
  let fixture: ComponentFixture<DeviceVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
