import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimTable } from './claim-table';

describe('ClaimTable', () => {
  let component: ClaimTable;
  let fixture: ComponentFixture<ClaimTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
