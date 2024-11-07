## 手动上传
```ts
const input = document.createElement('input')
if (extension_excel.limit && extension_excel.limit > 1) {
    input.setAttribute('multiple', 'multiple')
}
input.type = 'file'
input.onchange = async(e) => {
    const files = Object.values(e.target.files)
    const isExtension = extension(files, extension_excel)
    if (!isExtension) return
    this.loading = true
    const [err] = await uploadFile(files[0], type, colorType)
        .then(res => [null, res])
        .catch(e => [e])
    notify(err ? 'error' : 'success')
    this.loading = false
}
input.click()
```
