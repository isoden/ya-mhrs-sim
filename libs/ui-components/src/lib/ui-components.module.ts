import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconsModule } from './icons/icons.module'
import { PrettyNumberComponent } from './pretty-number/pretty-number.component'
import { ButtonComponent } from './button/button.component'

@NgModule({
  imports: [CommonModule],
  exports: [IconsModule, PrettyNumberComponent, ButtonComponent],
  declarations: [PrettyNumberComponent, ButtonComponent],
})
export class UiComponentsModule {}
