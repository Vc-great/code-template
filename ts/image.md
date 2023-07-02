## 二进制流文本
用于接口返回二进制流文本的场景
```ts
const json = {
    "img":""
}
parseBinaryStream(json.img)

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

## blob
```ts
//请求增加responseType: "blob"
axios({
    responseType: "blob"
})

//返回结果
const blob = new Blob([res], { type: 'image/png' })
img.src = window.URL.createObjectURL(blob)
```


## base64
```ts
 return "data:image/png;base64," + str
```
