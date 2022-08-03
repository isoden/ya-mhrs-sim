import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconsModule } from './icons/icons.module'
import { PrettyNumberComponent } from './pretty-number/pretty-number.component'
import { ButtonComponent } from './button/button.component'

@NgModule({
  imports: [CommonModule],
  exports: [
    IconsModule, // TODO: UiComponentsModule からではなく IconsModule 単体でも export したい。
    PrettyNumberComponent,
    ButtonComponent,
  ],
  declarations: [PrettyNumberComponent, ButtonComponent],
})
export class UiComponentsModule {}
