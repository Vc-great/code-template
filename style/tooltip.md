省略号

```vue
<template>
<span class="ellipsis">{{ scope.row.issueListName }}</span>
</template>

<style>
/*

单行文本溢出显示省略号
    1.设置宽度  width:*px;
    2.设置强制不换行  white-space:nowrap;
    3.设置溢出隐藏  overflow：hidden；
    4.设置溢出的标识为省略号  text-overflow:ellipsis;
*/
.ellipsis {
width: 98px;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
}

//多行文本溢出显示省略号

.more{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;    //设置行数
  overflow: hidden;        //超出隐藏
}

</style>
```

