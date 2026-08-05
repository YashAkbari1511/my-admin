import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { IncomeComponent } from './features/income/income.component';
import { SavingsComponent } from './features/savings/savings.component';
import { InvestmentsComponent } from './features/investments/investments.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'income', pathMatch: 'full' },
      { path: 'income', component: IncomeComponent },
      { path: 'savings', component: SavingsComponent },
      { path: 'investments', component: InvestmentsComponent },
      { path: 'yearly-saving', loadComponent: () => import('./features/yearly-saving/yearly-saving.component').then(m => m.YearlySavingComponent) }
    ]
  },
  { path: '**', redirectTo: 'income' }
];
