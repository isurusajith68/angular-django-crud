import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users').then((m) => m.Users),
      },
      {
        path: 'items',
        loadComponent: () => import('./pages/items/items').then((m) => m.Items),
      },
      {
        path:'characters',
        loadComponent: () => import('./pages/characters/characters').then((m) => m.Characters),
      },
      {
        path: 'characters/:id',
        loadComponent: () =>
          import('./pages/character-detail/character-detail').then((m) => m.CharacterDetail),
      }
    ],
  },
];
