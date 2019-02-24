import bindings from './bindings/names'
import types from './bindings/types'
import flatMap from 'lodash.flatmap'
import values from 'lodash.values'
import keys from 'lodash.keys'

export const isNumber = (num: any) => {
  return typeof num === 'number' && !isNaN(num)
}

export const getBindingNames = () => {
  return flatMap(values(bindings))
}

export const getTypeOfBinding = (bindingName: string) => {
  const index = values(bindings).findIndex(names => names.includes(bindingName))
  return keys(bindings)[index]
}

export const getBindingSymbol = (bindingType: string): string => {
  return (types as any)[bindingType]
}

export const createScope = () => getBindingNames().reduce((scope, name) => {
  const type = getTypeOfBinding(name)
  const symbol = getBindingSymbol(type)
  return { ...scope, [name]: `${symbol}?${name}` }
}, {})