import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpeVisualComponent } from './cpe-visual.component';

describe('CpeVisualComponent', () => {
  let component: CpeVisualComponent;
  let fixture: ComponentFixture<CpeVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpeVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpeVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
