## **multipart/form-data**

formData传递文件

**单文件**

```ts
const formData = new FormData()
Object.keys(data).forEach(key => {
  formData.append(key, data[key])
})
```

```ts
const formData = new FormData()
if (data) {
    Object.keys(data).forEach((key) => {
        const value = data[key as keyof typeof data]
        if (typeof key === 'string' && (typeof value === 'string' || (value as Blob) instanceof Blob)) {
            formData.append(key, value as unknown as string)
        }
    })
}
```

**多文件**

```ts
    const formData = new FormData()
    Object.keys(data).forEach(item => {
        // 多文件 逗号分隔
        if (item === 'file' && data[item]) {
            data[item].forEach(x => {
                formData.append('file', x['raw'])
            })
        } else {
            formData.append(item, data[item])
        }
    })
```

**headers**

```ts
return request({
  url: '/api/pres/business/v1/policy',
  method: 'POST',
  headers: { 'Content-Type': 'multipart/form-data' },
  data: formData
})
```

