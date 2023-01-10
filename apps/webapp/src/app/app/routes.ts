import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('~webapp/pages/simulator/routes').then((m) => m.routes),
  },
  {
    path: 'my-armors',
    loadChildren: () => import('~webapp/pages/my-armors/routes').then((m) => m.routes),
  },
  {
    path: 'my-talismans',
    loadChildren: () => import('~webapp/pages/my-talismans/routes').then((m) => m.routes),
  },
  {
    path: 'software-licenses',
    loadChildren: () => import('~webapp/pages/software-licenses/routes').then((m) => m.routes),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent,
      ),
  },
]
