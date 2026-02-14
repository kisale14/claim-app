import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchClaim } from './search-claim';

describe('SearchClaim', () => {
  let component: SearchClaim;
  let fixture: ComponentFixture<SearchClaim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchClaim]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchClaim);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
