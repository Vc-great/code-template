enum Status {
    SUCCESS = 'success',
    DANGER = 'danger',
    WARNING = 'warning',
}


## 1. 获取枚举的 key 类型
```ts
type StatusKey = keyof typeof Status;
// 'SUCCESS' | 'DANGER' | 'WARNING'

const keyArr: StatusKey[] = ['SUCCESS', 'DANGER']; // passed
```
## 获取key数组
```ts
Object.keys(Status) //[ 'SUCCESS', 'DANGER', 'WARNING' ]
```

## 2. 获取枚举的 value 类型
```ts
type StatusVal = `${Status}`;
// 'success' | 'danger' | 'warning'

const valArr: StatusVal[] = ['success', 'danger', 'warning'];  // passed
```

## 获取value数组
```ts
Object.values(Status) //[ 'success', 'danger', 'warning' ]
```

## 3. 合并枚举类型
```ts
enum Wait {
    WAITING = 'waiting',
}

const merge = { ...Status, ...Wait };
type MergeStatus = typeof merge;

const s1 = MergeStatus.WAITING; // warning
const s2 = MergeStatus.SUCCESS; // success
const s3 = MergeStatus.DANGER; // danger
const s4 = MergeStatus.WARNING; // warning
```

## 4. 使用 Exclude 剔除枚举中的值
```ts
type ErrStatus = Exclude<Status, Status.SUCCESS>;

let a: ErrStatus = Status.DANGER; // passed
a = Status.WARNING;  // passed
a = Status.SUCCESS;  // error
```
