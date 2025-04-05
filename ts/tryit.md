
## JS版本
```js
export const tryIt =  (func) => {
    return  (...args) => {
        try {
            const result =  func(...args);

            if (result && typeof result.then === 'function') {
                return result
                    .then((value) => [undefined, value])
                    .catch((err) => [err, undefined]);
            }

            return [undefined, result];
        } catch (err) {
            return [err, undefined];
        }
    };
};

```
## 获取key数组
```ts
/**
 * This is really a _best guess_ promise checking. You
 * should probably use Promise.resolve(value) to be 100%
 * sure you're handling it correctly.
 */
export const isPromise = (value: any): value is Promise<any> => {
        if (!value) return false
        if (!value.then) return false
        if (!isFunction(value.then)) return false
        return true
    }

/**
 * A helper to try an async function without forking
 * the control flow. Returns an error first callback _like_
 * array response as [Error, result]
 */
export const tryit = <Args extends any[], Return>(
        func: (...args: Args) => Return
    ) => {
        return (
            ...args: Args
        ): Return extends Promise<any>
            ? Promise<[Error, undefined] | [undefined, Awaited<Return>]>
            : [Error, undefined] | [undefined, Return] => {
            try {
                const result = func(...args)
                if (isPromise(result)) {
                    return result
                        .then(value => [undefined, value])
                        .catch(err => [err, undefined]) as Return extends Promise<any>
                        ? Promise<[Error, undefined] | [undefined, Awaited<Return>]>
                        : [Error, undefined] | [undefined, Return]
                }
                return [undefined, result] as Return extends Promise<any>
                    ? Promise<[Error, undefined] | [undefined, Awaited<Return>]>
                    : [Error, undefined] | [undefined, Return]
            } catch (err) {
                return [err as any, undefined] as Return extends Promise<any>
                    ? Promise<[Error, undefined] | [undefined, Awaited<Return>]>
                    : [Error, undefined] | [undefined, Return]
            }
        }
    }
```
