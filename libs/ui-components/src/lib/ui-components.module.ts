import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IconsModule } from './icons/icons.module'
import { ButtonComponent } from './button/button.component'
import { PaginatorComponent } from './paginator/paginator.component'
import { PrettyNumberDirective } from './directives/pretty-number/pretty-number.directive'
import { SignPipe } from './pipes/sign/sign.pipe'

@NgModule({
  imports: [CommonModule, IconsModule, FormsModule],
  exports: [IconsModule, PrettyNumberDirective, ButtonComponent, PaginatorComponent, SignPipe],
  declarations: [PrettyNumberDirective, ButtonComponent, PaginatorComponent, SignPipe],
})
export class UiComponentsModule {}
