## template

```vue
<template>
            <el-form
                label-position="left"
                ref="formRef"
                :model="form"
                :rules="formRules"
                :inline="true"
                label-width="150px"
                @submit.native.prevent
            >
                <FormItem
                    :detailText="isDetail"
                    form-item-style="width:45%"
                    :form-options="getIssueFormOption"
                    :form="form"
                >
                </FormItem>
            </el-form>
</template>
```

## formItemProps

```typescript
interface Props {
	detailText?:boolean
	form-item-style：string
	form-options:array
	form：object
}
```



## option

```typescript
interface Option {

}
```

## isSameorBefore

```typescript
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

//开始时间
change: (form, item, formOptions) => {
  const startTime = form['startTime']
  const endTime = form['endTime']
  // isSameOrBefore
  const isSameOrBefore = dayjs(startTime).isSameOrBefore(endTime, 'day')

  if (endTime && !isSameOrBefore) {
    form['endTime'] = ''
    Notification({
      type: 'error',
      title: '结束时间应该在开始时间之后'
    })
  }
}

//结束时间
change: (form, item, formOptions) => {
  const startTime = form['startTime']
  const endTime = form['endTime']
  const isSameOrBefore = dayjs(startTime).isSameOrBefore(endTime, 'day')

  if (!startTime) {
    return
  }

  if (endTime && !isSameOrBefore) {
    form['endTime'] = ''
    Notification({
      type: 'error',
      title: '结束时间应该在开始时间之后'
    })
  }
}
```

## isBefore

```typescript
// 开始时间
change: (form, item, formOptions) => {
  const startTime = form['startTime']
  const endTime = form['endTime']
  const isBefore = dayjs(startTime).isBefore(endTime, 'day')

  if (endTime && !isBefore) {
    form['endTime'] = ''
    Notification({
      type: 'error',
      title: '结束时间应该在开始时间之后'
    })
  }
}

//结束时间
change: (form, item, formOptions) => {
  const startTime = form['startTime']
  const endTime = form['endTime']
  const isBefore = dayjs(startTime).isBefore(endTime, 'day')

  if (!startTime) {
    return
  }

  if (endTime && !isBefore) {
    form['endTime'] = ''
    Notification({
      type: 'error',
      title: '结束时间应该在开始时间之后'
    })
  }
}
```

## upload

```vue
<template>
    <template #Upload="{ form, model, item }">
      <el-upload
        v-loading="uploadLoading"
        v-model:file-list="form[model]"
        class="upload"
        :http-request="uploadFile"
        multiple
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-preview="downLoad"
        :limit="99"
        >
   			 <el-button type="primary" :disabled="disabled">点击上传</el-button>
 			 </el-upload>
  	</template>
</template>

<script>
//option
  const formOption = {
    evidenceMaterials: {
        component: 'custom',
        slot: 'Upload',
        isShow: true,
        label: '佐证材料',
        defaultValue: []
    }
  }
  
const isDetail = computed(() => props.status === Status.Detail)
  
const beforeRemove = () => !isDetail.value

const handleRemove = uploadFile => {
    //biscLocalStorageApi.del([uploadFile.id])
}
  
  //多个文件uploading
  const uploadLoading = computed(() => {
    if (_.isEmpty(form.value.evidenceMaterials)) {
      return false
    }
    return form.value.evidenceMaterials.some(item => item.loading)
  })
  
  //上传文件
const uploadFile = async param => {
    const item = _.find(form.value.evidenceMaterials, ['uid', param.file.uid])
    item.loading = true
    const [e, res] = await biscLocalStorageApi.upload(param.file.name, param.file)
    item.loading = false
    if (e) {
        form.value.evidenceMaterials = _.filter(form.value.evidenceMaterials, item => item.uid !== param.file.uid)
        return
    }
    item.id = res.content.id
}

//下载
const downLoad = async uploadFile => {
    const id = uploadFile.id
    uploadFile.loading = true
    const [e, res] = await biscLocalStorageApi.downLoad(id)
    uploadFile.loading = false
    if (e) {
        return
    }
    downLoadFile(res, uploadFile.name)
}  
</script>


```

## formItem

```vue
<template>
    <div>
        <slot />
        <el-form-item
            v-for="(item, model) in getFormOptions"
            :key="model"
            :label="item.label"
            :prop="model"
            :style="props.formItemStyle"
            :required="item.required"
        >
            <!--text-->
            <div v-if="item.component === 'text'" :style="item.props.style">
                {{ item.text }}
            </div>
            <!--html-->
            <div v-if="item.component === 'html'" v-html="item.formatter()" />
            <template style="display: flex; width: 100%">
                <!--input-->
                <el-input
                    v-if="item.component === 'input'"
                    v-model="form[model]"
                    :disabled="item.disabled"
                    :type="item.inputType"
                    :style="item.props.style"
                    :rows="item.rows"
                    :maxlength="item.maxlength"
                    :show-word-limit="item.showWordLimit"
                    :placeholder="item.placeholder"
                />
                <!--  textarea  -->
                <el-input
                    v-if="item.component === 'textarea'"
                    v-model="form[model]"
                    :disabled="item.disabled"
                    type="textarea"
                    :style="item.props.style"
                    :rows="item.rows"
                    :maxlength="item.maxlength"
                    :show-word-limit="item.showWordLimit"
                    :placeholder="item.placeholder"
                />
                <!--password        -->
                <el-input
                    v-if="item.component === 'password'"
                    v-model="form[model]"
                    :disabled="item.disabled"
                    :type="showPassWord ? 'text' : 'password'"
                    :style="item.props.style"
                >
                    <template #append>
                        <el-button :icon="showPassWord ? Hide : View" @click="showPassWord = !showPassWord" />
                    </template>
                </el-input>
                <!-- input-number        -->
                <el-input-number
                    v-if="item.component === 'inputNumber'"
                    v-model="form[model]"
                    :min="item.min"
                    :max="item.max"
                    :style="item.props.style"
                    :disabled="item.disabled"
                    controls-position="right"
                    :size="item.size"
                    @change="item.change || (() => {})"
                />
                <!--字典-->
                <el-select
                    v-if="item.component === 'select'"
                    v-model="form[model]"
                    :multiple="item.multiple"
                    :disabled="item.disabled"
                    :clearable="item.clearable"
                    :style="item.props.style"
                    placeholder="请选择"
                    @change=";(item.change && item.change(form, item, formOptions)) || (() => {})"
                >
                    <el-option
                        v-for="option in item.enum"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>

                <el-cascader
                    v-if="item.component === 'cascader'"
                    v-model="form[model]"
                    :disabled="item.disabled"
                    :options="item.option"
                    :style="item.props.style"
                    :filterable="item.filterable"
                    :props="{ expandTrigger: item.expandTrigger }"
                    @change=";(item.change && item.change(form, item, formOptions)) || (() => {})"
                />
                <!--时间选择器-->
                <!--      format: 'yyyy-MM-dd',
                              valueFormat: 'yyyy-MM-dd'-->
                <el-date-picker
                    v-if="item.component === 'date'"
                    v-model="form[model]"
                    :style="item.props.style"
                    :type="item.type"
                    :disabled="item.disabled"
                    :format="item.format"
                    :value-format="item.valueFormat"
                    placeholder="选择日期"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change=";(item.change && item.change(form, item, formOptions)) || (() => {})"
                />
                <!--transfer-->
                <el-transfer v-if="item.component === 'transfer'" v-model="form[model]" :data="item.option" />
                <!--checkbox-group-->
                <div v-if="item.component === 'checkbox-group'">
                    <el-checkbox-group v-model="form[model]" :disabled="item.disabled">
                        <el-checkbox v-for="(check, ci) in item.option" :key="ci" :label="check.value"
                            >{{ check.label }}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
                <!--switch-->
                <div v-if="item.component === 'switch'" style="height: 40px; display: flex; align-items: center">
                    <el-switch
                        v-model="form[model]"
                        :active-color="item.activeColor"
                        :active-text="item.activeText"
                        :inactive-color="item.inactiveColor"
                        :inactive-text="item.inactiveText"
                        style="display: block"
                    />
                </div>
                <!--radio-->
                <div v-if="item.component === 'radio'">
                    <el-radio-group
                        v-model="form[model]"
                        :disabled="item.disabled"
                        @change=";(item.change && item.change(form, item, formOptions)) || (() => {})"
                    >
                        <el-radio v-for="(radio, ri) in item.option" :key="ri" :label="radio.value"
                            >{{ radio.label }}
                        </el-radio>
                    </el-radio-group>
                </div>
                <!--custom-->
                <template v-if="item.component === 'custom'">
                    <slot :name="item.slot" :item="item" :form="form" :model="model" :formOptions="formOptions" />
                </template>
            </template>
        </el-form-item>
    </div>
</template>

<script setup lang="ts">
import { Hide, View } from '@element-plus/icons-vue'
import _ from 'lodash-es'
import { computed, defineProps, ref } from 'vue'

const props = defineProps(['detailText', 'formOptions', 'form', 'formItemStyle'])
const showPassWord = ref(false)
const formType = [
    'input',
    'select',
    'date',
    'radio',
    'switch',
    'checkbox-group',
    'inputNumber',
    'textarea',
    'cascader',
    'password',
    'transfer'
]
const getFormOptions = computed(() => {
    const setAttrebute = option => {
        return _.reduce(
            option,
            (result, value, key) => {
                result[key] = {
                    ...value,
                    isShow: _.isBoolean(value.isShow) ? value.isShow : true,
                    component: formType.includes(value.component) && props.detailText ? 'text' : value.component,
                    label: value.colon === false ? value.label : value.label + ':',
                    enum: _.isFunction(value.enum) ? value.enum() : value.enum,
                    props: {
                        ...value.props,
                        style: {
                            width: '100%',
                            ...value.props?.style
                        }
                    }
                }

                return result
            },
            {}
        )
    }
    const filterByIsShow = option => {
        return _.reduce(
            option,
            (result, value, key) => {
                if (value.isShow) {
                    result[key] = value
                }
                return result
            },
            {}
        )
    }
    return _.flow([setAttrebute, filterByIsShow])(props.formOptions)
})
</script>

<style scoped></style>

```

