declare namespace Webapp {
  import { Augmentation } from '@ya-mhrs-sim/data'
  import { Talisman, HunterType } from './models'

  export type LocalStorageSchema = {
    // 選択しているカラースキーマ
    mode: 'dark' | 'light'

    // 選択しているハンタータイプ
    hunterType: HunterType

    // 登録した護石のリスト
    talismans: Talisman[]

    // 登録した傀異錬成防具の強化情報のリスト
    augmentations: Augmentation[]
  }
}
