import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core'

@Component({
  selector: 'uic-paginator',
  templateUrl: './paginator.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  @Input()
  page = 1

  @Output()
  pageChange = new EventEmitter<number>()

  @Input()
  pageSizes: number[] = []

  @Output()
  pageSizesChange = new EventEmitter<number[]>()

  @Input()
  pageSize = 0

  @Output()
  pageSizeChange = new EventEmitter<number>()

  @Input()
  total = 0

  get disabledPreviousButton(): boolean {
    return this.page === 1
  }

  get disabledNextButton(): boolean {
    return this.to === this.total
  }

  get from(): number {
    return (this.page - 1) * this.pageSize + 1
  }

  get to(): number {
    return Math.min(this.from + this.pageSize - 1, this.total)
  }

  increment(): void {
    this.pageChange.emit(this.page + 1)
  }

  decrement(): void {
    this.pageChange.emit(this.page - 1)
  }

  onChange(value: number): void {
    this.pageChange.emit(1)
    this.pageSizeChange.emit(value)
  }
}
