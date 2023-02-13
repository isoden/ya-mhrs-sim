export const OUTLINE_LV_4 =
  /* prettier-ignore */
  `M 0, 10
   L 60, 25.5
   L 90, 54
   V 78
   L 52, 112
   L 68, 94
   L 104, 155
   L 52, 155
   L 62, 170
   H 0
   L -62, 170
   L -52, 155
   L -104, 155
   L -68, 94
   L -52, 112
   L -90, 78
   V 54
   L -60, 25.5
   Z`

export const OUTLINE_LV_1_2_3 =
  /* prettier-ignore */
  `M 0, 25.5
   H 60
   L 90, 54
   V 78
   L 54, 112
   L 83, 160
   L 76, 170.5
   H 0
   L -76, 170.5
   L -83, 160
   L -54, 112
   L -90, 78
   V 54
   L -60, 25.5
   Z`

export const SHAPE_LV_1 =
  /* prettier-ignore */
  `M 0, 36
   L 20, 68
   L 20, 72
   L 0, 115
   L -20, 72
   L -20, 68
   Z`

export const SHAPE_LV_2 =
  /* prettier-ignore */
  `M 0, 36
   H 30
   L 52, 68
   L 52, 72
   L 10, 115
   H -10
   L -52, 72
   L -52, 68
   L -30, 36
   Z`

export const SHAPE_LV_3 =
  /* prettier-ignore */
  `M 0, 36
   H 56
   L 80, 59
   L 80, 74
   L 32, 115
   H 0
   H -32
   L -80, 74
   L -80, 59
   L -56, 36
   Z`

export const SHAPE_LV_4 =
  /* prettier-ignore */
  `M 0, 22
   L 56, 36
   L 80, 59
   L 80, 74
   L 32, 115
   L 0, 132
   L -32, 115
   L -80, 74
   L -80, 59
   L -56, 36
   Z`

export const triangle = (x: number, y: number, w: number, h: number) =>
  /* prettier-ignore */
  `M ${x}, ${y}
   l ${w / 2}, ${h}
   h ${-w}
   Z`

export const TRIANGLE_LV_1_AT_0 = triangle(0, 128, 40, 32)

export const TRIANGLE_LV_2_AT_0 = triangle(-52, 128, 40, 32)
export const TRIANGLE_LV_2_AT_1 = triangle(52, 128, 40, 32)

export const TRIANGLE_LV_3_AT_0 = triangle(-52, 128, 40, 32)
export const TRIANGLE_LV_3_AT_1 = triangle(0, 128, 40, 32)
export const TRIANGLE_LV_3_AT_2 = triangle(52, 128, 40, 32)

export const TRIANGLE_LV_4_AT_0 = triangle(-72, 118, 32, 28)
export const TRIANGLE_LV_4_AT_1 = triangle(-32, 132, 32, 28)
export const TRIANGLE_LV_4_AT_2 = triangle(32, 132, 32, 28)
export const TRIANGLE_LV_4_AT_3 = triangle(72, 118, 32, 28)
