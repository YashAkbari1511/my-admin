import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface YearlyData {
  year: number;
  openingBalance: number;
  amountAdded: number;
  returnEarned: number;
  closingBalance: number;
}

@Component({
  selector: 'app-yearly-saving',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './yearly-saving.component.html',
  styleUrls: ['./yearly-saving.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearlySavingComponent implements OnInit {
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);

  calcForm: FormGroup;
  tableData: YearlyData[] = [];
  
  totalInvested = 0;
  totalReturns = 0;
  finalBalance = 0;

  constructor() {
    this.calcForm = this.fb.group({
      yearlyAmount: [120000, [Validators.required, Validators.min(0)]],
      returnRate: [12, [Validators.required, Validators.min(0)]],
      years: [10, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.calculate();
    // Auto-calculate on value changes
    this.calcForm.valueChanges.subscribe(() => {
      if (this.calcForm.valid) {
        this.calculate();
      } else {
        this.tableData = [];
        this.totalInvested = 0;
        this.totalReturns = 0;
        this.finalBalance = 0;
        this.cdr.markForCheck();
      }
    });
  }

  calculate() {
    if (this.calcForm.invalid) return;

    const { yearlyAmount, returnRate, years } = this.calcForm.value;
    
    let currentOpening = 0;
    this.tableData = [];
    let cumulativeInvested = 0;

    for (let i = 1; i <= years; i++) {
      const amountAdded = Number(yearlyAmount);
      const balanceBeforeReturn = currentOpening + amountAdded;
      const returnEarned = balanceBeforeReturn * (Number(returnRate) / 100);
      const closingBalance = balanceBeforeReturn + returnEarned;

      this.tableData.push({
        year: i,
        openingBalance: currentOpening,
        amountAdded: amountAdded,
        returnEarned: returnEarned,
        closingBalance: closingBalance
      });

      cumulativeInvested += amountAdded;
      currentOpening = closingBalance;
    }

    this.totalInvested = cumulativeInvested;
    this.finalBalance = currentOpening;
    this.totalReturns = this.finalBalance - this.totalInvested;
    
    this.cdr.markForCheck();
  }
}
