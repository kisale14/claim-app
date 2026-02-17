import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ServicesClaim } from '../../services/services-claim.service';

@Component({
  selector: 'app-search-claim',
  imports: [DialogModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './search-claim.html',
  styleUrl: './search-claim.css',
})
export class SearchClaim {
  @Input() VisibilityForm: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  searchClaimForm!: FormGroup;

  constructor(private fb: FormBuilder, private servicesClaim: ServicesClaim) {}

  ngOnInit() {
    this.initForm();
  }

  visible: boolean = false;

  closeForm() {
    this.visibleChange.emit(false);
  }

  private initForm() {
    this.searchClaimForm = this.fb.group({
      claimNumber: ['', Validators.required],
      name: ['', Validators.required],
      identification: ['', Validators.required],
    });
  }

  onSearch() {
    this.servicesClaim.filterClaims(this.searchClaimForm.value).subscribe((filteredClaims) => {
      console.log('Reclamos filtrados:', filteredClaims);
    });
    console.log(this.searchClaimForm.value)
  }
}
