import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialsCreateComponent } from './credentials-create.component';

describe('CredentialsCreateComponent', () => {
  let component: CredentialsCreateComponent;
  let fixture: ComponentFixture<CredentialsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CredentialsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredentialsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
