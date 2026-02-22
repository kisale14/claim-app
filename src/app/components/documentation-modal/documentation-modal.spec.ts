import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationModal } from './documentation-modal';

describe('DocumentationModal', () => {
  let component: DocumentationModal;
  let fixture: ComponentFixture<DocumentationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentationModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentationModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
