/**
 * @fileoverview アイコンの Facade
 */

import { NgModule } from '@angular/core'
import { TablerIconsModule } from 'angular-tabler-icons'
import {
  IconBrightness,
  IconDiamond,
  IconListSearch,
  IconMenu2,
  IconShield,
  IconSword,
  IconX,
  IconArrowsVertical,
  IconChevronUp,
  IconChevronRight,
  IconChevronDown,
  IconChevronLeft,
} from 'angular-tabler-icons/icons'
import { IconComponent } from './components/icon/icon.component'

@NgModule({
  imports: [
    TablerIconsModule.pick({
      IconBrightness,
      IconDiamond,
      IconListSearch,
      IconMenu2,
      IconShield,
      IconSword,
      IconX,
      IconArrowsVertical,
      IconChevronUp,
      IconChevronRight,
      IconChevronDown,
      IconChevronLeft,
    }),
  ],
  exports: [IconComponent],
  declarations: [IconComponent],
})
export class IconsModule {}
