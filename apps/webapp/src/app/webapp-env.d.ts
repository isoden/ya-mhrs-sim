declare namespace Webapp {
  import { Talisman, Augmentation } from '@ya-mhrs-sim/data'
  import { HunterType } from './models'

  export type LocalStorageSchema = {
    // ログ出力フラグ
    debug?: 'on' | 'off'

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
