import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Income, Savings, Investment, YearlySaving } from '../models/finance.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  
  // Reactive user stream
  private user$ = user(this.auth);

  private get uid(): string {
    const u = this.auth.currentUser;
    if (!u) throw new Error('User not authenticated');
    return u.uid;
  }

  // Income
  getIncomes(): Observable<Income[]> {
    return this.user$.pipe(
      switchMap(u => {
        if (!u) return of([]);
        const incomesRef = collection(this.firestore, `users/${u.uid}/income`);
        const q = query(incomesRef, orderBy('createdAt', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<Income[]>;
      })
    );
  }

  addIncome(income: Income) {
    const incomesRef = collection(this.firestore, `users/${this.uid}/income`);
    return addDoc(incomesRef, income);
  }

  updateIncome(id: string, data: Partial<Income>) {
    const docRef = doc(this.firestore, `users/${this.uid}/income/${id}`);
    return updateDoc(docRef, data);
  }

  deleteIncome(id: string) {
    const docRef = doc(this.firestore, `users/${this.uid}/income/${id}`);
    return deleteDoc(docRef);
  }

  // Savings
  getSavings(): Observable<Savings[]> {
    return this.user$.pipe(
      switchMap(u => {
        if (!u) return of([]);
        const savingsRef = collection(this.firestore, `users/${u.uid}/savings`);
        const q = query(savingsRef, orderBy('createdAt', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<Savings[]>;
      })
    );
  }

  addSavings(savings: Savings) {
    const savingsRef = collection(this.firestore, `users/${this.uid}/savings`);
    return addDoc(savingsRef, savings);
  }

  updateSavings(id: string, data: Partial<Savings>) {
    const docRef = doc(this.firestore, `users/${this.uid}/savings/${id}`);
    return updateDoc(docRef, data);
  }

  deleteSavings(id: string) {
    const docRef = doc(this.firestore, `users/${this.uid}/savings/${id}`);
    return deleteDoc(docRef);
  }

  // Investments
  getInvestments(): Observable<Investment[]> {
    return this.user$.pipe(
      switchMap(u => {
        if (!u) return of([]);
        const investmentsRef = collection(this.firestore, `users/${u.uid}/investments`);
        const q = query(investmentsRef, orderBy('createdAt', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<Investment[]>;
      })
    );
  }

  addInvestment(investment: Investment) {
    const investmentsRef = collection(this.firestore, `users/${this.uid}/investments`);
    return addDoc(investmentsRef, investment);
  }

  updateInvestment(id: string, data: Partial<Investment>) {
    const docRef = doc(this.firestore, `users/${this.uid}/investments/${id}`);
    return updateDoc(docRef, data);
  }

  deleteInvestment(id: string) {
    const docRef = doc(this.firestore, `users/${this.uid}/investments/${id}`);
    return deleteDoc(docRef);
  }

  // Yearly Savings
  getYearlySavings(): Observable<YearlySaving[]> {
    return this.user$.pipe(
      switchMap(u => {
        if (!u) return of([]);
        const ysRef = collection(this.firestore, `users/${u.uid}/yearlySavings`);
        const q = query(ysRef, orderBy('createdAt', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<YearlySaving[]>;
      })
    );
  }

  addYearlySaving(saving: YearlySaving) {
    const ysRef = collection(this.firestore, `users/${this.uid}/yearlySavings`);
    return addDoc(ysRef, saving);
  }

  updateYearlySaving(id: string, data: Partial<YearlySaving>) {
    const docRef = doc(this.firestore, `users/${this.uid}/yearlySavings/${id}`);
    return updateDoc(docRef, data);
  }

  deleteYearlySaving(id: string) {
    const docRef = doc(this.firestore, `users/${this.uid}/yearlySavings/${id}`);
    return deleteDoc(docRef);
  }
}
