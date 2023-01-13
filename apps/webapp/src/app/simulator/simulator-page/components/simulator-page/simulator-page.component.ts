import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { Skill, skills } from '@ya-mhrs-sim/data'
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs'
import { every } from 'lodash-es'
import { LocalStorageService } from '~webapp/services/local-storage.service'
import { SimulationResult, SimulatorService } from '~webapp/services/simulator.service'
import { HunterType, WeaponSlots } from '~webapp/models'
import { invariant } from '~webapp/functions/asserts'
import { SimulatorWidgetComponent } from '../simulator-widget/simulator-widget.component'
import { SkillPickerComponent } from '../skill-picker/skill-picker.component'

const DEFAULT_EXCLUEDED_SKILLS: Skill['name'][] = ['伏魔響命', '龍気活性', '狂竜症【蝕】']

export function useForm(defaultHunterType: HunterType) {
  const fb = inject(FormBuilder)

  return fb.nonNullable.group({
    includedSkills: fb.nonNullable.group(
      skills.reduce(
        (group, skill) => ({ ...group, [skill.name]: 0 }),
        {} as Record<Skill['name'], number>,
      ),
    ),
    excludedSkills: fb.nonNullable.array(
      DEFAULT_EXCLUEDED_SKILLS.map(() => fb.nonNullable.control(false)),
    ),
    hunterType: fb.nonNullable.control<HunterType>(defaultHunterType),
    weaponSlots: fb.nonNullable.control(WeaponSlots[0]),
  })
}

@Component({
  standalone: true,
  selector: 'app-simulator-page',
  templateUrl: './simulator-page.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiComponentsModule,
    SkillPickerComponent,
    SimulatorWidgetComponent,
  ],
})
export class SimulatorPageComponent implements OnInit, OnDestroy {
  weaponSlots = WeaponSlots
  includedSkills = skills
  excludedSkills = this.includedSkills.filter((skill) =>
    DEFAULT_EXCLUEDED_SKILLS.includes(skill.name),
  )

  #onDestroy = new Subject<void>()

  simulationResult$!: Observable<SimulationResult | null>

  form = useForm(this.localStorage.get('hunterType', 'type01'))

  constructor(
    private readonly localStorage: LocalStorageService<Webapp.LocalStorageSchema>,
    private readonly simulator: SimulatorService,
  ) {}

  ngOnInit(): void {
    this.simulationResult$ = this.form.valueChanges.pipe(
      takeUntil(this.#onDestroy),
      switchMap(({ includedSkills, excludedSkills, hunterType, weaponSlots }) => {
        // FormControl が disabled の場合はフィールドが入ってこないため Partial<typeof value> 型になっている
        invariant(includedSkills)
        invariant(excludedSkills)
        invariant(hunterType)
        invariant(weaponSlots)

        if (every(includedSkills, (value) => value === 0)) {
          // スキルが選択されていない場合は検索しない
          return of(null)
        }

        return this.simulator.simulate({
          includedSkills: includedSkills as Required<typeof includedSkills>,
          excludedSkills: excludedSkills.flatMap((checked, i) =>
            checked ? DEFAULT_EXCLUEDED_SKILLS[i] : [],
          ),
          hunterType,
          weaponSlots,
        })
      }),
    )

    // ハンタータイプはキャラクター作成時の情報に紐づくためほぼ変更されることはないので一度選択した値は永続化する
    this.form.controls.hunterType.valueChanges
      .pipe(takeUntil(this.#onDestroy))
      .subscribe((kind) => this.localStorage.set('hunterType', kind))
  }

  ngOnDestroy(): void {
    this.#onDestroy.next()
    this.#onDestroy.complete()
  }

  resetForm() {
    const hunterType = this.form.value.hunterType

    this.form.reset({
      hunterType,
    })
  }
}
