import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    title: 'ビルドシミュレーター | モンスターハンターライズ：サンブレイク ビルドシミュレーター',
    pathMatch: 'full',
    loadComponent: () =>
      import('./simulator-page/components/simulator-page/simulator-page.component').then(
        (m) => m.SimulatorPageComponent,
      ),
  },
]
