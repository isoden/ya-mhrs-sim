import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../pages/simulator/routes').then((m) => m.routes),
  },
  {
    path: 'my-armors',
    loadChildren: () => import('../pages/my-armors/routes').then((m) => m.routes),
  },
  {
    path: 'my-talismans',
    loadChildren: () => import('../pages/my-talismans/routes').then((m) => m.routes),
  },
  {
    path: 'software-licenses',
    loadChildren: () => import('../pages/software-licenses/routes').then((m) => m.routes),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent,
      ),
  },
]
