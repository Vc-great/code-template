```vue
<template>
  <el-dialog align-center :title="title" v-model="dialogVisible" :close-on-click-modal="false" width="820px" @close="cancel">
    <div style="overflow: auto; height: 640px" v-loading="loading">
      <!--表单-->
      <el-form
        label-position="left"
        ref="formRef"
        :model="form"
        :rules="formRules"
        :inline="true"
        label-width="120px"
      >
        <FormItem :form-options="getOption" :form="form" />
      </el-form>
    </div>
    <!---->
    <template #footer>
            <span class="dialog-footer">
              <el-button
                  v-for="(item,index) in buttonOptionFunc()"
                  :key="index"
                  :type="item.type"
                  @click="item.click"
              >{{ item.label }}
              </el-button>
                <el-button plain @click="cancel">取消</el-button>
                <el-button :loading="loading" type="primary" @click="submit" v-if="showButton">确定</el-button>
            </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import useStore from './store'
import { Status } from '@/enum/status'
import {formOption} from './form-option'
import {
  createFormByFormOption,
  setRulesByFormOption,
  updateFormByFormOption
} from '@/utils/form-option'
import type { FormInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import _ from "lodash-es";
import { computed, onMounted, reactive, ref } from 'vue'
import FormItem from './components/form-item.vue'
import { buttonOptionFuncType, buttonOptionType } from "@/types/table";

const store = useStore()

const emits = defineEmits(['cancel','getTableData'])
const props = defineProps(['status','listRow'])
const rowDetail = ref({})

const title =
  props.status === Status.Create ? '新建' : props.status === Status.Edit ? '编辑' : '详情'
const loading = ref(false)

const dialogVisible = ref(true)

const form = ref(createFormByFormOption(formOption))

const formRef = ref<FormInstance>()

const formRules: { any } = reactive(setRulesByFormOption(formOption))

const disabled = computed(() => props.status === Status.Detail)

const showButton = computed(() => props.status !== Status.Detail)

const isDetail = computed(() => props.status === Status.Detail)

const getOption = computed(() => {
  return formOption.map(item => {
    return {
      ...item,
      disabled: props.status === Status.Detail
    }
  })
})


function buttonOptionFunc():buttonOptionType {
  const result =  [
    {
      label: isDetail?'关闭':'取消',
      type:'',
      click: ()=>{
        cancel()
      },
      has:()=>{
        return true
      }
    },
    {
      label: '确定',
      type: 'primary',
      click: ()=>{
        submit()
      },
      has:()=>{
        return !isDetail
      }
    }
  ]
  return result.filter(item=>item.has())
}


function setForm() {
  form.value = ref(updateFormByFormOption(formOption, rowDetail))
}
async function getDetail(){

  //todo 详情接口
  const [e，res] = await (listRow.id)
  if（e）{
    return
  }
  rowDetail.value = res.content
}

async function submit() {
  const data = {
    ...form
  }

  loading.value = true
  //todo 接口
  const [e, res] = await (data)
  loading.value = false
  if (e) {
    return
  }
  ElNotification.success(res.message)
  emits('cancel')
  await store.getTableData()
}

function cancel() {
  emits('cancel')
}

async function init() {
 if(props.status !==  Status.Create){
   await getDetail()
   setForm()
 }

}
</script>

<style lang="scss" scoped>

</style>

```

## createFormByFormOption

```typescript
export const createFormByFormOption = formOption => {
    return _.reduce(
        formOption,
        (result: any, item: any) => {
            if (!item.model) {
                return result
            }
            result[item.model] = item.defaultValue
            return result
        },
        {}
    )
}
```

## updateFormByFormOption

```typescript
export const updateFormByFormOption = (formOption, data) => {
    return _.reduce(
        formOption,
        (result: any, item: any) => {
            if (!item.model) {
                return result
            }
            result[item.model] = item.updateFormValue
                ? item.updateFormValue({ data, formOption, item })
                : data[item.model]
            return result
        },
        {}
    )
}
```

## setRulesByFormOption

```typescript
export const setRulesByFormOption = formOption => {
    return _.reduce(
        formOption,
        (result: any, item: any) => {
            if (!item.rules || !item.model) {
                return result
            }
            result[item.model] = item.rules
            return result
        },
        {}
    )
}
```

