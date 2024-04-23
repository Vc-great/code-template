##覆盖属性Omit
```ts
# 在 TypeScript 3.5 或更高版本中，可以使用 Omit<T, K> 类型从 T 中删除属性 K。
 示例:
 type HexColorLine = Omit<Line, 'color'> & {
  color: number;
}
 ```

/*
* description: 忽略属性
* 示例:
* const person = {
*   name: 'zhufeng',
*   age: 11,
*   address: '回龙观'
* }
* type OmitAddress = Omit<typeof person, 'address'>
  */
  export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/*
*覆盖属性
* 示例:
* type TypeStr = { b: string };
* type TypeNum = Override<TypeStr, {b: number;}>;
* */
  //覆盖属性
  export type Overwrite<P, S> = Omit<P, keyof S> & S

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U
