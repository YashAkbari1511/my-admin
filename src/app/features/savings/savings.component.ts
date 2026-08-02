import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';
import { Savings } from '../../models/finance.model';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavingsComponent implements OnInit {
  financeService = inject(FinanceService);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);


  savingsList: Savings[] = [];
  filteredSavings: Savings[] = [];
  totalSavings = 0;
  isLoading = true;

  // Modal State
  showDialog = false;
  isEditMode = false;
  editingId: string | null = null;
  savingsForm: FormGroup;

  showConfirmDialog = false;
  itemToDelete: Savings | null = null;

  constructor() {
    this.savingsForm = this.fb.group({
      title: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit() {
    this.financeService.getSavings().subscribe(savings => {
      this.savingsList = savings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.filteredSavings = [...this.savingsList];
      this.totalSavings = savings.reduce((acc, curr) => acc + curr.amount, 0);
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredSavings = this.savingsList.filter(savings => 
      savings.title.toLowerCase().includes(filterValue)
    );
    this.cdr.markForCheck();
  }

  openAddDialog() {
    this.isEditMode = false;
    this.editingId = null;
    this.savingsForm.reset({ date: new Date().toISOString().split('T')[0] });
    this.showDialog = true;
    this.cdr.markForCheck();
  }

  openEditDialog(savings: Savings) {
    this.isEditMode = true;
    this.editingId = savings.id!;
    this.savingsForm.patchValue({
      title: savings.title,
      amount: savings.amount,
      date: new Date(savings.date).toISOString().split('T')[0]
    });
    this.showDialog = true;
    this.cdr.markForCheck();
  }

  closeDialog() {
    this.showDialog = false;
    this.cdr.markForCheck();
  }

  async saveSavings() {
    if (this.savingsForm.invalid) return;
    
    const formValue = this.savingsForm.value;
    const savingsData: Partial<Savings> = {
      title: formValue.title,
      amount: Number(formValue.amount),
      userId: 'mock-user-id',
      date: formValue.date
    };

    try {
      if (this.isEditMode && this.editingId) {
        await this.financeService.updateSavings(this.editingId, savingsData);
      } else {
        await this.financeService.addSavings(savingsData as Savings);
      }
      this.closeDialog();
    } catch (error) {
      console.error(error);
    }
  }

  promptDelete(savings: Savings) {
    this.itemToDelete = savings;
    this.showConfirmDialog = true;
    this.cdr.markForCheck();
  }

  async confirmDelete() {
    if (this.itemToDelete && this.itemToDelete.id) {
      await this.financeService.deleteSavings(this.itemToDelete.id);
      this.showConfirmDialog = false;
      this.itemToDelete = null;
      this.cdr.markForCheck();
    }
  }
}
