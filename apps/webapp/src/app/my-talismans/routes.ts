import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    title: '護石管理 | モンスターハンターライズ：サンブレイク スキルシミュレーター',
    pathMatch: 'full',
    loadComponent: () =>
      import('./my-talismans-page/components/my-talismans-page/my-talismans-page.component').then(
        (m) => m.MyTalismansPageComponent,
      ),
  },
]
