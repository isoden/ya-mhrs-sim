import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    title: 'ソフトウェアライセンス | モンスターハンターライズ：サンブレイク ビルドシミュレーター',
    pathMatch: 'full',
    loadComponent: () =>
      import(
        './software-licenses-page/components/software-licenses-page/software-licenses-page.component'
      ).then((m) => m.SoftwareLicensesPageComponent),
  },
]
