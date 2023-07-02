**downLoadRequest**

```ts
export function downLoad(url, params) {
    const server = axios.create()
    server({
        url: url + '?' + qs.stringify(params, { indices: false }),
        method: 'get',
        responseType: 'blob',
        headers: { Authorization: getToken() }
    }).then(response => {
        // 修改下载文件名
        const fileName = response.headers['content-disposition'].split(';')[1].split('filename=')[1]
        downloadFile(response.data, fileName)
    }).catch(error => {
        if (error?.response?.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
            const reader = new FileReader()
            reader.readAsText(error.response.data, 'utf-8')
            reader.onload = function(e) {
                const errorMsg = JSON.parse(reader.result).message
                Notification.error({
                    title: errorMsg,
                    duration: 5000
                })
            }
        }
    })
}
```

**downLoadFile**

```
```

