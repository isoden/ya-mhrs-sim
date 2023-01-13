import { Decoration } from '@ya-mhrs-sim/data'
import { groupBy } from 'lodash-es'

/**
 * 空きスロットへの装飾品の分配を最適化してスロット効率を最大化するためのクラス
 */
export class Distributor {
  // 装飾品をスロットサイズごとにグループ化
  // 雰囲気を掴むための擬似コード
  // {
  //   1: [火炎珠【１】, ...],
  //   2: [翔蟲珠【２】, ...],
  //   3: [合気珠【３】, ...],
  //   4: [翔蟲珠Ⅱ【４】, ...],
  // }
  #decorations: { [slotSize: number]: Decoration[] }

  constructor(decorations: Decoration[]) {
    this.#decorations = groupBy(decorations, (decoration) => decoration.slotSize)
  }

  /**
   * 渡された空きスロットに対して最適な装飾品を返す
   *
   * @param slotSizes
   */
  distribute(slotSizes: number[]): Decoration[] {
    /**
     * 以下のフローで装飾品を探す
     * 1. slotSize と一致する装飾品を探し、 存在すればその装飾品を返す。
     * 2. 存在しない場合は slotSize - 1 の装飾品を探し、 存在すればその装飾品を返す。 この処理を slotSize = 1 まで繰り返す。
     * 3. 見つからない場合は undefined を返す
     *
     * @param slotSize - 空きスロットサイズ
     */
    const distribute = (slotSize: number): Decoration | undefined => {
      const items = this.#decorations[slotSize] ?? []

      if (items.length > 0) {
        return items.shift()
      }

      // 最小サイズで見つからなかった場合は終了
      if (slotSize === 1) {
        return
      }

      return distribute(slotSize - 1)
    }

    return slotSizes.map(distribute).filter((x): x is NonNullable<typeof x> => x != null)
  }
}
