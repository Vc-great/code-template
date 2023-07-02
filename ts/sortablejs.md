## **sortablejs**

安装

```ts
npm install sortablejs --save
```



**引入**

```ts
//引入
import Sortable from 'sortablejs'
```

Template

```vue
<el-table-column
  label=""
  align="center"
  width="40"
>
  <template v-slot="scope">
    <div>
    <img src="./img/拖拽.png" alt="" height="20" width="20" style="cursor: pointer">
    </div>
  </template>
</el-table-column>
```



**initSort**

```tsx
async function initSort() {
    await nextTick()
    const el = document.querySelector('#sort-table tbody')
    if (!el) return
    new Sortable(el, {
        onEnd: async evt => {
            // 监听拖动结束事件
            // console.log('当前行的被拖拽前的顺序', evt.oldIndex) // 当前行的被拖拽前的顺序
            // console.log('当前行的被拖拽后的顺序', evt.newIndex) // 当前行的被拖拽后的顺序
            if (evt.oldIndex === evt.newIndex) {
                return
            }

            domCache.value = {
                el: el as HTMLElement,
                newIndex: Number(evt.newIndex),
                oldIndex: Number(evt.oldIndex)
            }
            //sortNo
            meetingTypeCode.splice(evt.newIndex, 0, meetingTypeCode.splice(evt.oldIndex, 1)[0])

            meetingTypeCode.forEach((item, index) => {
                item.sortNo = index + 1
            })
          //恢复dom顺序
            resetDomSort()
          	//其他操作
        }
    })
}
```



**updateSort**

```tsx
async updateSort() {
  const { oldIndex, newIndex } = this.domCache

  const data = _.cloneDeep(this.modelList)
  const currRow = data.splice(oldIndex, 1)[0]
  // 然后把这一项加入到新位置上
  data.splice(newIndex, 0, currRow)
  const sortData = data.map((x, index) => {
    return {
      ...x,
      sort: index
    }
  })

  const [e] = await TargetaimsApi.update(sortData)
  if (e) return
  // 请求完成后不重新请求列表数据,用户体验更好
}
```

**resetDomSort**

```ts
//恢复dom顺序
function resetDomSort() {
    const { el, newIndex, oldIndex } = domCache.value
    const newNode = el.children[newIndex]
    const oldNode = el.children[oldIndex]
    // 先删除移动的节点
    el.removeChild(newNode)
    // 再插入移动的节点到原有节点，还原了移动的操作
    if (newIndex > oldIndex) {
        el.insertBefore(newNode, oldNode)
    } else {
        el.insertBefore(newNode, oldNode.nextSibling)
    }
}
```

