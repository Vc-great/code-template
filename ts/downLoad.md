
**demo**
```ts
async function downLoad(uploadFile) {
    const id = uploadFile.fileId
    uploadFile.loading = true
    const [e, res] = await biscLocalStorageApi.downLoad(id)
    uploadFile.loading = false
    if (e) {
        return
    }
    await downLoadFile(res, uploadFile.fileName)
}
```

**downLoadFile**

```
export default function downLoadFile(file, fileName) {
    const url = window.URL.createObjectURL(new Blob([file]))
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
```


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

**arraybuffer**

```ts
function parseBinaryStream(binaryData) {
  // 创建一个Uint8Array来存储二进制数据
  var uint8Array = new Uint8Array(binaryData.length);
  // 将二进制数据逐个字节拷贝到Uint8Array中
  for (var i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }
  // 创建一个Blob对象，用于存储二进制数据
  var blob = new Blob([uint8Array]);
  // 创建一个URL对象，将Blob对象转换为可识别的格式
  var url = URL.createObjectURL(blob);
  // 返回可识别格式的URL
  return url;
}
```

**arraybuffer转换为base64格式图片数据在img标签显示：**
```ts
return 'data:image/png;base64,' + btoa(
    new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
```
