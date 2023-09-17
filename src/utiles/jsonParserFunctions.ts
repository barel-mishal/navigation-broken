/**
 * @example JSON.stringify(obj, replacer)
 * @param key 
 * @param value 
 * @returns 
 */
export function replacer(key: any, value: any) {
    if (value instanceof Map) {
      return { __type: 'Map', value: Object.fromEntries(value) }
    }
    if (value instanceof Set) {
      return { __type: 'Set', value: Array.from(value) }
    }
    return value
  }
  
  
  /**
   * @example JSON.parse(str, reviver)
   * @param key 
   * @param value 
   * @returns 
   */
  export function reviver(key: any, value: any) {
    if (value?.__type === 'Set') { 
      return new Set(value.value) 
    }
    if (value?.__type === 'Map') { 
      return new Map(Object.entries(value.value)) 
    }
    return value
  }

  export function sorted<T>(array: T[], func: (a: T, b: T) => number) {
    const temp = JSON.parse(JSON.stringify(array))
    return temp.sort(func)
}