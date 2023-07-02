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

