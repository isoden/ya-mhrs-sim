import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { match } from 'ts-pattern'
import { Decoration } from '@ya-mhrs-sim/data'
import { invariant } from '~webapp/functions/asserts'
import { SkillModel } from '~webapp/models'
import {
  OUTLINE_LV_4,
  OUTLINE_LV_1_2_3,
  SHAPE_LV_1,
  SHAPE_LV_2,
  SHAPE_LV_3,
  SHAPE_LV_4,
  TRIANGLE_LV_1_AT_0,
  TRIANGLE_LV_2_AT_0,
  TRIANGLE_LV_2_AT_1,
  TRIANGLE_LV_3_AT_0,
  TRIANGLE_LV_3_AT_1,
  TRIANGLE_LV_3_AT_2,
  TRIANGLE_LV_4_AT_0,
  TRIANGLE_LV_4_AT_1,
  TRIANGLE_LV_4_AT_2,
  TRIANGLE_LV_4_AT_3,
} from './shapes'

type Props = {
  path: string
  classNames: Record<string, boolean>
  strokeWidth: number
  z: number
}

const rings: Record<SlotSize, Record<number, (1 | 0)[]>> = {
  1: {
    1: [1],
  },
  2: {
    1: [0, 1],
    2: [1, 1],
  },
  3: {
    1: [0, 1, 0],
    2: [1, 0, 1],
    3: [1, 1, 1],
  },
  4: {
    1: [0, 0, 0, 1],
    2: [1, 0, 0, 1],
    3: [1, 1, 0, 1],
    4: [1, 1, 1, 1],
  },
}

const fills: Record<SlotSize, Record<number, (1 | 0)[]>> = {
  1: {
    1: [1],
  },
  2: {
    1: [1, 0],
    2: [1, 1],
  },
  3: {
    1: [1, 0, 0],
    2: [1, 0, 1],
    3: [1, 1, 1],
  },
  4: {
    1: [0, 1, 0, 0],
    2: [0, 1, 1, 0],
    3: [1, 1, 1, 0],
    4: [1, 1, 1, 1],
  },
}
const width = 222
const height = 180

type SlotSize = 1 | 2 | 3 | 4

@Component({
  standalone: true,
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class SlotComponent {
  @Input()
  set size(size: number) {
    invariant(size === 1 || size === 2 || size === 3 || size === 4)

    this.#size = size
  }
  get size(): SlotSize {
    return this.#size
  }
  #size!: SlotSize

  @Input()
  decoration?: Decoration

  @Input()
  set extendedSize(extendedSize: number | undefined) {
    this.#extendedSize = extendedSize
  }
  get extendedSize(): number {
    return this.#extendedSize ?? 0
  }
  #extendedSize: number | undefined

  get viewBox() {
    return `${-width / 2} 0 ${width} ${height}`
  }

  @Input()
  width = 30

  get outlinePath() {
    if (this.size === 4) {
      return OUTLINE_LV_4
    }

    return OUTLINE_LV_1_2_3
  }

  get outlineClassNames(): string[] {
    return [
      this.extendedSize > 0 && this.size !== this.extendedSize ? ['stroke-green-600'] : [],
      this.extendedSize === this.size ? ['fill-green-700'] : ['fill-[#7a7a7a]'],
    ].flat(1)
  }

  getShapes(): Props[] {
    const slotSize = this.decoration?.slotSize ?? 0
    const fill = fills[this.size][slotSize] ?? []
    const ring = rings[this.size]
    const storkeWidthBold = 22
    const sizeEqualExtendedSize = this.size === this.extendedSize

    const highlight = (i: number) => Boolean(ring[this.extendedSize]?.[i]) && i < this.size

    const classNames = (filled: boolean, highlight: boolean) => ({
      [filled ? this.getFill() : 'fill-neutral-900']: true,
      'stroke-green-400': highlight,
      'dark:stroke-green-500': highlight,
      'stroke-[#cacaca]': !highlight,
    })

    return match(this.size)
      .with(1, () => [
        {
          path: TRIANGLE_LV_1_AT_0,
          classNames: classNames(Boolean(fill[0]), highlight(0)),
          strokeWidth: storkeWidthBold,
          z: 2,
        },
        {
          path: SHAPE_LV_1,
          classNames: classNames(slotSize >= 1, sizeEqualExtendedSize),
          strokeWidth: storkeWidthBold,
          z: 1,
        },
      ])
      .with(2, () => [
        {
          path: TRIANGLE_LV_2_AT_0,
          classNames: classNames(Boolean(fill[0]), highlight(0)),
          strokeWidth: storkeWidthBold,
          z: 3,
        },
        {
          path: TRIANGLE_LV_2_AT_1,
          classNames: classNames(Boolean(fill[1]), highlight(1)),
          strokeWidth: storkeWidthBold,
          z: 4,
        },

        {
          path: SHAPE_LV_2,
          classNames: classNames(slotSize >= 2, sizeEqualExtendedSize),
          strokeWidth: storkeWidthBold,
          z: 1,
        },
        {
          path: SHAPE_LV_1,
          classNames: classNames(slotSize >= 1, sizeEqualExtendedSize),
          strokeWidth: 8,
          z: 2,
        },
      ])
      .with(3, () => [
        {
          path: TRIANGLE_LV_3_AT_0,
          classNames: classNames(Boolean(fill[0]), highlight(0)),
          strokeWidth: storkeWidthBold,
          z: 4,
        },
        {
          path: TRIANGLE_LV_3_AT_1,
          classNames: classNames(Boolean(fill[1]), highlight(1)),
          strokeWidth: storkeWidthBold,
          z: 6,
        },
        {
          path: TRIANGLE_LV_3_AT_2,
          classNames: classNames(Boolean(fill[2]), highlight(2)),
          strokeWidth: storkeWidthBold,
          z: 5,
        },

        {
          path: SHAPE_LV_3,
          classNames: classNames(slotSize >= 3, sizeEqualExtendedSize),
          strokeWidth: storkeWidthBold,
          z: 1,
        },
        {
          path: SHAPE_LV_2,
          classNames: classNames(slotSize >= 2, sizeEqualExtendedSize),
          strokeWidth: 8,
          z: 2,
        },
        {
          path: SHAPE_LV_1,
          classNames: classNames(slotSize >= 1, sizeEqualExtendedSize),
          strokeWidth: 8,
          z: 3,
        },
      ])
      .with(4, () => [
        {
          path: TRIANGLE_LV_4_AT_0,
          classNames: classNames(Boolean(fill[0]), highlight(0)),
          strokeWidth: storkeWidthBold,
          z: 7,
        },
        {
          path: TRIANGLE_LV_4_AT_1,
          classNames: classNames(Boolean(fill[1]), highlight(1)),
          strokeWidth: storkeWidthBold,
          z: 5,
        },
        {
          path: TRIANGLE_LV_4_AT_2,
          classNames: classNames(Boolean(fill[2]), highlight(2)),
          strokeWidth: storkeWidthBold,
          z: 6,
        },
        {
          path: TRIANGLE_LV_4_AT_3,
          classNames: classNames(Boolean(fill[3]), highlight(3)),
          strokeWidth: storkeWidthBold,
          z: 8,
        },

        {
          path: SHAPE_LV_4,
          classNames: classNames(slotSize >= 4, sizeEqualExtendedSize),
          strokeWidth: storkeWidthBold,
          z: 1,
        },
        {
          path: SHAPE_LV_3,
          classNames: classNames(slotSize >= 3, sizeEqualExtendedSize),
          strokeWidth: 9,
          z: 2,
        },
        {
          path: SHAPE_LV_2,
          classNames: classNames(slotSize >= 2, sizeEqualExtendedSize),
          strokeWidth: 9,
          z: 3,
        },
        {
          path: SHAPE_LV_1,
          classNames: classNames(slotSize >= 1, sizeEqualExtendedSize),
          strokeWidth: 9,
          z: 4,
        },
      ])
      .exhaustive()
      .sort((a, b) => a.z - b.z)
  }

  getFill() {
    if (!this.decoration) {
      return 'fill-neutral-900'
    }

    return SkillModel.fill(this.decoration.skills[0][0])
  }
}
