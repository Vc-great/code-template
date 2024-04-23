## headerButtonOption

```vue
<script setup lang="ts">
  
  type buttonOptionType = {
    label: string
    type?: string // 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
    click: (row?: never) => void
    disabled?: (row?: never) => boolean
    has?: (row?: never) => boolean
}[]
  
  const headerButtonOption: ComputedRef<buttonOptionType> = computed(() => {
    const result = [
        {
            type: 'primary',
            label: '新建',
            click: () => {
                create()
            },
            disabled: () => {
                return false
            },
            has: () => {
                return true
            }
        }
    ].filter(x => x.has())
    return result
})
</script>
```

## tableOption

```vue
<script setup lang="ts"> 
  type tableOptionType = {
    id?: string
    prop: string
    label: string
    width?: string
    sortable?: boolean
    formatter?: (row, column: TableColumnCtx<never>, cellValue, index) => never
    tooltip?: boolean
    columnKey?: string
    filters?: never[]
    filterValue?: (prop: string) => never
    filterMethod?: (value: never, row: never) => never
    type?: string
}
  
  const tableOption: tableOptionType[] = [
    {
        id: '',
        prop: 'type',
        label: '任务类型',
        formatter: row => {
            return ''
        }
    },
    {
        id: '',
        type: '',
        prop: 'time',
        label: '时间',
        sortable: 'custom'
    },

]
</script>
```

## sortChange

```vue
<script setup lang="ts">
 function sortChange({ prop, order }) {
    // ascending descending
    // startTime,asc  createTime,desc
    if (prop === '') {
        params.value.sort =""
    }
    store.getTableData()
}
</script>
```

## 合并表格
```vue
<template>
  <el-table
      :span-method="arraySpanMethod"
  >
  </el-table>
</template>
<script !src="">
import _ from 'lodash-es'
export function mergeCell(list) {
  return merageList(oneReverseTwo(fixInitData(merageOneDimensionality(twoReverseOne(list)))), list)
  // 转成一维数组
  function twoReverseOne(list) {
      //在表格中是第几列
    const result = [[], []]

    list.forEach(item => {
        //todo 要合并的列
      result[0].push(item.issueDictionaryCategory)
      result[1].push(item.issueDictionaryItem)
    })

    return result
  }

  // 合并 一位数组
  function merageOneDimensionality(list) {
    list.forEach((item, li) => {
      // 遍历 item

      for (let i = 0; i < item.length; i++) {
        let sameIndex = []
        // 找到相同
        for (let j = i + 1; j < item.length; j++) {
          if (!item[i]) continue

          if (item[j] === item[i]) {
            sameIndex.push(j)
            // 数组最后更新数组
            if (j === item.length - 1) {
              updataArr(sameIndex, item)
              item[i] = sameIndex.length + 1
            }
          } else {
            updataArr(sameIndex, item)
            item[i] = sameIndex.length + 1
            sameIndex = []
            i = j - 1
            break
          }
        }
      }
    })

    return list
  }

  function updataArr(sameIndex, item) {
    sameIndex.forEach(x => {
      item[x] = 0
    })
  }

  // undefined 变 1
  function fixInitData(list) {
    return list.map(item => {
      return item.map(x => {
        return x === undefined ? 1 : x
      })
    })
  }

  //
  function oneReverseTwo(list) {
    console.log('-> list', _.cloneDeep(list))
    if (_.isEmpty(list)) {
      return []
    }

    const result = []

    for (let i = 0; i < list[0].length; i++) {
      result[i] = []
      list.forEach((item, index) => {
        result[i].push(item[i])
      })
    }
    return result
  }

  // 合并数据
  function merageList(result, list) {
    const data = list.map((x, i) => {
      return {
        ...x,
        subjectDepth: Math.max(...result.map(x => x.length)) || 0,
        rowspan: result[i], // 合并行数
        colspan: 1 // 合并列数
      }
    })
    return data
  }
}
</script>

```



## template

```vue
<template>
<el-table
    v-loading="tableLoading"
    :data="tableList"
    @sort-change="sortChange"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column label="序号" type="index" width="50" align="center" />
    <template v-for="(item, index) in tableOption">
      <el-table-column
        v-if="!item.type"
        :key="index"
        align="center"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :sortable="item.sortable"
        :formatter="item.formatter"
        :show-overflow-tooltip="item.tooltip"
        :column-key="item.columnKey"
        :filters="item.filters"
        :filter-multiple="false"
        :filtered-value="item.filterValue && item.filterValue(item.prop)"
        :filter-method="item.filterMethod && item.filterMethod"
      >
      </el-table-column>
      <!--textButton                    -->
      <el-table-column
        v-if="item.type === 'textButton'"
        :key="index"
        align="center"
        :width="item.width"
        :label="item.label"
      >
        <template #default="scope">
          <el-button v-if="scope.row.taskId" text @click="gzwTaskDetail(scope.row)">{{
              scope.row.taskId
            }}</el-button>
        </template>
      </el-table-column>

      <!--detail-->
      <el-table-column
        v-if="item.type === 'detail'"
        :key="index"
        align="center"
        :width="item.width"
        :label="item.label"
      >
        <template #default="scope">
          <el-button v-if="newFeedBackTime(scope.row)" text @click="feedBackDetail(scope.row)">{{
              newFeedBackTime(scope.row)
            }}</el-button>
          <el-button v-if="scope.row.secondReturnTime" text @click="routerFeedBackDetail(scope.row)"
          >反馈详情</el-button
          >
        </template>
      </el-table-column>
    </template>
    <!-- 操作   -->
    <el-table-column align="center" label="操作">
      <template #default="scope">
        <el-button
          v-for="button in tableButtonOption(scope.row)"
          :key="button.label"
          :disabled="button.disabled(scope.row)"
          text
          @click="button.click(scope.row)"
        >{{ button.label }}</el-button
        >
      </template>
    </el-table-column>
    <!--暂无数据    -->
    <template #empty>
      <el-empty description="" />
    </template>
  </el-table>
</template>
```

