import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortProfileConnectionComponent } from './port-profile-connection.component';

describe('PortProfileConnectionComponent', () => {
  let component: PortProfileConnectionComponent;
  let fixture: ComponentFixture<PortProfileConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortProfileConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortProfileConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
