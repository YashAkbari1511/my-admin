import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';
import { Investment } from '../../models/finance.model';

@Component({
  selector: 'app-investments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvestmentsComponent implements OnInit {
  financeService = inject(FinanceService);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);



  investmentsList: Investment[] = [];
  filteredInvestments: Investment[] = [];
  totalInvestment = 0;
  totalReturn = 0;
  totalProfit = 0;
  isLoading = true;

  // Modal State
  showDialog = false;
  isEditMode = false;
  editingId: string | null = null;
  investmentForm: FormGroup;

  showConfirmDialog = false;
  itemToDelete: Investment | null = null;

  constructor() {
    this.investmentForm = this.fb.group({
      title: ['', Validators.required],
      investmentAmount: [0, [Validators.required, Validators.min(0.01)]],
      returnAmount: [0],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit() {
    this.financeService.getInvestments().subscribe(investments => {
      this.investmentsList = investments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.filteredInvestments = [...this.investmentsList];
      this.totalInvestment = investments.reduce((acc, curr) => acc + curr.investmentAmount, 0);
      this.totalReturn = investments.reduce((acc, curr) => acc + (curr.returnAmount || 0), 0);
      this.totalProfit = this.totalReturn - this.totalInvestment;
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredInvestments = this.investmentsList.filter(inv => 
      inv.title.toLowerCase().includes(filterValue)
    );
    this.cdr.markForCheck();
  }

  openAddDialog() {
    this.isEditMode = false;
    this.editingId = null;
    this.investmentForm.reset({ date: new Date().toISOString().split('T')[0] });
    this.showDialog = true;
    this.cdr.markForCheck();
  }

  openEditDialog(investment: Investment) {
    this.isEditMode = true;
    this.editingId = investment.id!;
    this.investmentForm.patchValue({
      title: investment.title,
      investmentAmount: investment.investmentAmount,
      returnAmount: investment.returnAmount || 0,
      date: new Date(investment.date).toISOString().split('T')[0]
    });
    this.showDialog = true;
    this.cdr.markForCheck();
  }

  closeDialog() {
    this.showDialog = false;
    this.cdr.markForCheck();
  }

  async saveInvestment() {
    this.investmentForm.markAllAsTouched();
    if (this.investmentForm.invalid) return;
    
    const formValue = this.investmentForm.value;
    const investmentData: Partial<Investment> = {
      title: formValue.title,
      investmentAmount: Number(formValue.investmentAmount),
      returnAmount: Number(formValue.returnAmount) || 0,
      date: formValue.date,
      createdAt: Date.now()
    };

    try {
      if (this.isEditMode && this.editingId) {
        await this.financeService.updateInvestment(this.editingId, investmentData);
      } else {
        await this.financeService.addInvestment(investmentData as Investment);
      }
      this.closeDialog();
    } catch (error) {
      console.error(error);
    }
  }

  promptDelete(investment: Investment) {
    this.itemToDelete = investment;
    this.showConfirmDialog = true;
    this.cdr.markForCheck();
  }

  async confirmDelete() {
    if (this.itemToDelete && this.itemToDelete.id) {
      await this.financeService.deleteInvestment(this.itemToDelete.id);
      this.showConfirmDialog = false;
      this.itemToDelete = null;
      this.cdr.markForCheck();
    }
  }
}
