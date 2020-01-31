import { createParamDecorator } from '@nestjs/common'
import { CAN_DO_ANY_SYMBOL, WANT_TO_KNOW_IF_CAN_DO_ANY } from '../constants'

/**
 * Returns a callback function that returns whether or not this user can perform [action] to any document
 *
 * Remember that the return type is () => boolean, therefore you need to run the function to know its value
 *
 */
export const CanDoAny = (): ParameterDecorator => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any, key, index): void => {
    Reflect.defineMetadata(WANT_TO_KNOW_IF_CAN_DO_ANY, true, target[key])
    createParamDecorator(() => {
      return (): boolean => Reflect.getMetadata(CAN_DO_ANY_SYMBOL, target[key])
    })()(target, key, index)
  }
}
