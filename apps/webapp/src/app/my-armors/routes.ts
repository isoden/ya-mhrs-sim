import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    title: '傀異錬成防具管理 | モンスターハンターライズ：サンブレイク ビルドシミュレーター',
    pathMatch: 'full',
    loadComponent: () =>
      import('./my-armors-page/components/my-armors-page/my-armors-page.component').then(
        (m) => m.MyArmorsPageComponent,
      ),
  },
]
