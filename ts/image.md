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

arraybuffer 是一种原始二进制数据缓冲区，用于处理较低级别的二进制数据。当你设置 responseType: 'arraybuffer' 时，返回的数据是一个 JavaScript ArrayBuffer 对象，表示原始的二进制数据。

适用场景
你需要对数据进行详细的操作或解析。
适合用于处理那些不直接显示的二进制数据，比如音频、视频、文件处理等。
需要通过 JavaScript 操作这些二进制数据，比如用 Canvas 渲染图像。
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

const buffer = res.data
const blob = new Blob([buffer], { type: 'image/png' })

this.imgSrc=  window.URL.createObjectURL(blob)

</script>
```

## blob
blob 是一种表示不可变的原始数据的类文件对象，它通常用于处理像图片、视频、音频等文件。当你设置 responseType: 'blob' 时，返回的数据是一个 Blob 对象。

适用场景
适合用于直接显示图像、音频、视频等媒体文件。
适合于在浏览器中显示文件或用于下载文件。
如果你只想直接展示或下载文件而不做进一步的处理，使用 blob 是更方便的选择。

```ts
//请求增加responseType: "blob"
const res = axios({
    responseType: "blob"
})
const buffer = res.data
//返回结果
img.src = window.URL.createObjectURL(buffer)
```


## base64
```ts
 return "data:image/png;base64," + str
```
