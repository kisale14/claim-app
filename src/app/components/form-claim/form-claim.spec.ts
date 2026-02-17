import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormClaim } from './form-claim';

describe('FormClaim', () => {
  let component: FormClaim;
  let fixture: ComponentFixture<FormClaim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormClaim]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormClaim);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
