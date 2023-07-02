## template

```vue
<template>
        <el-tabs class="tabs" v-model="currentTab"  @tab-click="tabsHandleClick">
            <el-tab-pane
                v-for="(item, index) in appTabs"
                :key="index"
                :label="item.label"
                :name="item.value"
            ></el-tab-pane>
        </el-tabs>
</template>
```

## tabOption

```vue
<script setUp lang=ts>
const tabOption = reactive([
    {
        label: '',
        value: ""
    },
    {
        label: '',
        value: ""
    }
])
</script>
```

## tabClick

```vue

<script setUp lang=ts>
const tabsHandleClick = tab => {
    store.initParams({ state: tab.props.name })
    store.getTableData()
}
</script>

```

