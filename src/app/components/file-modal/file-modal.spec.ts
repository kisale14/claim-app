import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileModal } from './file-modal';

describe('FileModal', () => {
  let component: FileModal;
  let fixture: ComponentFixture<FileModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
