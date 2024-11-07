Qs

```ts
qs.stringify({ a: ['b', 'c', 'd'] });
// 'a[0]=b&a[1]=c&a[2]=d'

qs.stringify({ a: ['b', 'c', 'd'] }, { indices: false });
// 'a=b&a=c&a=d'

//arrayFormat 选项进行格式化输出
qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'indices' })
// 'a[0]=b&a[1]=c'


qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'brackets' })
// 'a[]=b&a[]=c'

qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'repeat' })
// 'a=b&a=c'


const obj = {
    arr: [
        { value: 1, label: "啊" }
    ],
    num: 2,

};

// 将对象序列化为 URL 查询字符串
qs.stringify(obj, { encode: true, allowDots: true });
//arr[0].value=1&arr[0].label=啊&num=2

//axios
axios({
  paramsSerializer(params) {
    return qs.stringify(params,{ indices: false })
  }
})
```

