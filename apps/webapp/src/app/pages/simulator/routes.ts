import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    title: 'スキルシミュレーター | モンスターハンターライズ：サンブレイク スキルシミュレーター',
    pathMatch: 'full',
    loadComponent: () =>
      import('./simulator-page/components/simulator-page/simulator-page.component').then(
        (m) => m.SimulatorPageComponent,
      ),
  },
]
