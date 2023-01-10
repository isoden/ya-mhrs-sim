import { Component, Type } from '@angular/core'
import * as atl from '@testing-library/angular'
import {
  RenderComponentOptions,
  RenderResult,
  RenderTemplateOptions,
} from '@testing-library/angular'
import UserEvent from '@testing-library/user-event'

type RenderOptionsExtra = {
  userEvent?: Parameters<typeof UserEvent.setup>[0]
}
type ReturnExtra = {
  user: ReturnType<typeof UserEvent.setup>
}

/**
 * オプションを渡せるように拡張した render 関数
 */
function render<ComponentType>(
  component: Type<ComponentType>,
  renderOptions?: RenderComponentOptions<ComponentType> & RenderOptionsExtra,
): Promise<RenderResult<ComponentType, ComponentType> & ReturnExtra>
function render<WrapperType = WrapperComponent>(
  template: string,
  renderOptions?: RenderTemplateOptions<WrapperType> & RenderOptionsExtra,
): Promise<RenderResult<WrapperType> & ReturnExtra>
async function render<SutType, WrapperType = SutType>(
  sut: Type<SutType> | string,
  {
    userEvent,
    ...renderOptions
  }:
    | (RenderComponentOptions<SutType> & RenderOptionsExtra)
    | (RenderTemplateOptions<WrapperType> & RenderOptionsExtra) = {},
): Promise<RenderResult<SutType> & ReturnExtra> {
  const user = UserEvent.setup(userEvent)

  // @ts-expect-error FIXME: 直せたら直す
  const view = await atl.render(sut, renderOptions)

  return {
    ...view,
    user,
  }
}

// https://github.com/testing-library/angular-testing-library/blob/5b9fa848cfa91a58f082b6cea2b93b2d563200f5/projects/testing-library/src/lib/testing-library.ts#L470-L471
// eslint-disable-next-line @angular-eslint/component-selector
@Component({ selector: 'atl-wrapper-component', template: '' })
declare class WrapperComponent {}

export * from '@testing-library/angular'
export { render }
