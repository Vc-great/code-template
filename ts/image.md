## 二进制流文本
> 用于接口返回二进制流文本的场景
**二进制转Uint8Array再转blob**
```vue
<template>
    <el-image  :src="url"/> 
</template>
<script>
const json = {
  "img":""
}
const url = parseBinaryStream(json.img)

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
</script>

```
响应为Uint8Array,通过btoa转化为Base64编码
```vue
<template>
  <img :src="imgSrc"  />
</template>
<script>
const res = await axios({
  url:'/getImg',
  method:'get',
  responseType: 'arraybuffer',
})
//btoa() 方法可以将一个二进制字符串（例如，将字符串中的每一个字节都视为一个二进制数据字节）编码为 Base64 编码的 ASCII 字符串。
let imgSrc =
    'data:image/png;base64,' +
    btoa(new Uint8Array(data)
        .reduce((data, byte) => data + String.fromCharCode(byte), ''))


</script>
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
