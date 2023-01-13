import { trigger, state, style, transition, animate } from '@angular/animations'
import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { Subject, takeUntil } from 'rxjs'
import { useMatchMediaObservable } from '~webapp/functions/useMatchMedia'
import { invariant } from '~webapp/functions/asserts'
import { SimulationResult } from '~webapp/services/simulator.service'
import { screens } from '~webapp/constants'
import { BuildViewerComponent } from '../build-viewer/build-viewer.component'

const defaultHeight = 56

@Component({
  standalone: true,
  selector: 'app-simulator-widget',
  templateUrl: './simulator-widget.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // TODO: prefers-reduced-motion を参照して Transition の有効無効を切り替えたい
    trigger('expansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '{{ height }}px', visibility: 'visible' }), {
        params: { height: defaultHeight },
      }),
      transition('expanded <=> collapsed, void => collapsed', animate('250ms ease-in-out')),
    ]),
  ],
  imports: [CommonModule, UiComponentsModule, BuildViewerComponent],
})
export class SimulatorWidgetComponent implements AfterViewInit, OnDestroy {
  @Input()
  result: SimulationResult | null = null

  @ViewChild('expandable')
  expandableElement?: ElementRef<HTMLDivElement>

  expanded = true

  #dragging = false

  height = defaultHeight

  #matches$ = useMatchMediaObservable()(`(max-width: ${screens.md})`)

  #onDestroy = new Subject<void>()

  get draggable() {
    return this.expanded
  }

  ngAfterViewInit(): void {
    this.#matches$.pipe(takeUntil(this.#onDestroy)).subscribe((matches) => {
      if (!matches && this.expandableElement?.nativeElement) {
        this.expandableElement.nativeElement.style.width = ''
        this.expandableElement.nativeElement.style.visibility = ''
      }
    })
  }

  ngOnDestroy(): void {
    this.#onDestroy.next()
    this.#onDestroy.complete()
  }

  toggle() {
    if (this.#dragging) {
      return
    }
    this.expanded = !this.expanded
  }

  getExpandedState() {
    return {
      value: this.expanded ? 'expanded' : 'collapsed',
      params: { height: this.height ?? defaultHeight },
    }
  }

  onPointerEvent(event: PointerEvent) {
    invariant(this.expandableElement, "Don't call this method before ngOnAfterViewInit")

    if (!this.expanded) {
      return
    }

    const targetElement = event.target as HTMLElement

    switch (event.type) {
      case 'pointerdown': {
        console.log('pointerdown', event)
        if (this.#dragging) {
          return
        }

        this.#dragging = true
        this.height = this.expandableElement.nativeElement.getBoundingClientRect().height
        targetElement.setPointerCapture(event.pointerId)
        return
      }

      case 'pointermove': {
        console.log('pointermove', event)

        if (!this.#dragging) {
          return
        }

        this.height = Math.max(this.height - event.movementY, 0)
        return
      }

      case 'pointerup': {
        console.log('pointerup', event)
        if (!this.#dragging) {
          return
        }

        this.#dragging = false
        targetElement.releasePointerCapture(event.pointerId)
        return
      }

      default: {
        console.log(event.type, event)
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    invariant(this.expandableElement, "Don't call this method before ngOnAfterViewInit")

    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
      return
    }

    if (!this.expanded) {
      return
    }

    const STEP = 50

    switch (event.key) {
      case 'ArrowUp': {
        const maxHeight = Number.parseInt(
          window.getComputedStyle(this.expandableElement.nativeElement).maxHeight,
          10,
        )

        this.height = Math.min(maxHeight, this.height + STEP)
        return
      }

      case 'ArrowDown': {
        this.height = Math.max(this.height - STEP, 0)
        return
      }
    }
  }
}
