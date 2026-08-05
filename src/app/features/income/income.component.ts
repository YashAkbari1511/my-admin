import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';
import { Income } from '../../models/finance.model';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeComponent implements OnInit {
  financeService = inject(FinanceService);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);


  incomes: Income[] = [];
  filteredIncomes: Income[] = [];
  totalIncome = 0;
  isLoading = true;

  // Modal State
  showDialog = false;
  isEditMode = false;
  editingId: string | null = null;
  incomeForm: FormGroup;

  showConfirmDialog = false;
  itemToDelete: Income | null = null;

  constructor() {
    this.incomeForm = this.fb.group({
      title: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit() {
    this.financeService.getIncomes().subscribe(incomes => {
      this.incomes = incomes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.filteredIncomes = [...this.incomes];
      this.totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredIncomes = this.incomes.filter(income => 
      income.title.toLowerCase().includes(filterValue)
    );
    this.cdr.markForCheck();
  }

  openAddDialog() {
    this.isEditMode = false;
    this.editingId = null;
    this.incomeForm.reset({ date: new Date().toISOString().split('T')[0] });
    this.showDialog = true;
    this.cdr.markForCheck();
  }

  openEditDialog(income: Income) {
    this.isEditMode = true;
    this.editingId = income.id!;
    this.incomeForm.patchValue({
      title: income.title,
      amount: income.amount,
      date: new Date(income.date).toISOString().split('T')[0]
    });
    this.showDialog = true;
    this.cdr.markForCheck();
  }

  closeDialog() {
    this.showDialog = false;
    this.cdr.markForCheck();
  }

  async saveIncome() {
    this.incomeForm.markAllAsTouched();
    if (this.incomeForm.invalid) return;
    
    const formValue = this.incomeForm.value;
    const incomeData: Partial<Income> = {
      title: formValue.title,
      amount: Number(formValue.amount),
      date: formValue.date,
      createdAt: Date.now()
    };

    try {
      if (this.isEditMode && this.editingId) {
        await this.financeService.updateIncome(this.editingId, incomeData);
      } else {
        await this.financeService.addIncome(incomeData as Income);
      }
      this.closeDialog();
    } catch (error) {
      console.error(error);
    }
  }

  promptDelete(income: Income) {
    this.itemToDelete = income;
    this.showConfirmDialog = true;
    this.cdr.markForCheck();
  }

  async confirmDelete() {
    if (this.itemToDelete && this.itemToDelete.id) {
      await this.financeService.deleteIncome(this.itemToDelete.id);
      this.showConfirmDialog = false;
      this.itemToDelete = null;
      this.cdr.markForCheck();
    }
  }
}
