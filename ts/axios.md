
# axios 封装
request.ts
```ts
import axios, {type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig} from 'axios'
import _ from 'lodash-es'
import { createUniAppAxiosAdapter } from "@uni-helper/axios-adapter";
import type{ AxiosInstance} from "axios";
import {toast} from "@/store/toast";
import {
    handleDownloadError,
    handleNetworkError,
    handleTimeOutError,
    setRequestHeaderToken
} from "@/utils/netWork";


//todo showToast title字段只能展示7个汉字

//todo 成功和失败的规则

axios.defaults.adapter = createUniAppAxiosAdapter();


const instance:AxiosInstance = axios.create({
    baseURL : import.meta.env.VITE_BASE_API,
    timeout : Number(import.meta.env.VITE_REQUEST_TIME_OUT)
})

instance.interceptors.request.use(
    async (config:InternalAxiosRequestConfig) => {

        config = setRequestHeaderToken(config)

        return config
    },
    error => [error, undefined]
)

declare module 'axios' {
     interface AxiosInterceptorManager<V> {
        use(onFulfilled?: (value: V) => any | Promise<any>, onRejected?: (error: any) => any, options?: AxiosInterceptorOptions): number;
        eject(id: number): void;
        clear(): void;
    }

    interface interceptors {
        request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
        response: AxiosInterceptorManager<AxiosResponse>;
    }
}

instance.interceptors.response.use(
    (res):[any,any,AxiosResponse] => {
        const isSuccess = res.data?.code >= 200 && res.data?.code < 300
        const isHttpSuccess = res.status >= 200 && res.status < 300

        //有code 并且code 不在200-300之间 为异常
        if (_.has(res.data, 'code') && !isSuccess) {
            toast.error(res?.data?.message)
            return [res.data, undefined,res]
        }

        return [undefined, res.data,res]
    },
    (error:AxiosError) => {
        //超时错误
        handleTimeOutError(error)
        // 网络错误
        handleNetworkError(_.get(error,'response.data.status') || _.get(error,'response.data.code'))
        // 下载错误处理
        handleDownloadError(error)
        // 业务错误


        return [error, undefined]
    }
)







export {instance}

```

request-interceptors.ts
```ts
import {getToken} from "@/utils/token";
import {toast} from "@/store/toast";
import type {AxiosError, InternalAxiosRequestConfig} from "axios";
import _ from "lodash";

export const setRequestHeaderToken = (config:InternalAxiosRequestConfig) => {
    config.headers["token"] = getToken() ||'Bearer'
    return config;
};


export const handleDownloadError=(error:AxiosError)=>{
    if (
        error?.response?.data &&
        error?.response?.data instanceof Blob &&
        error.response.data.type.toLowerCase().indexOf('json') !== -1
    ) {
        const reader = new FileReader()
        reader.readAsText(error.response.data, 'utf-8')
        reader.onload = function (e) {
            if (typeof reader.result === "string") {
                const errorMsg = JSON.parse(reader.result).message
                toast.error(errorMsg ||'')
            }

        }
    }
}


export const handleTimeOutError = (error:AxiosError)=>{
    if(error.code === 'ETIMEDOUT'){
        toast.error('请求超时,请重试!')
    }
}

export const handleNetworkError = (errStatus?: number): void => {
    if(!errStatus){
        return
    }
    const networkErrMap: any = {
        "400": ()=>{
          toast.error("错误的请求")
        },
        "401": ()=>{
            toast.error("未授权，请重新登录")
        },
        "403": ()=>{
            toast.error("拒绝访问")
        },
        "404": "请求错误，未找到该资源",
        "405": "请求方法未允许",
        "408": "请求超时",
        "500": "服务器端出错",
        "501": "网络未实现",
        "502": "网络错误",
        "503": "服务不可用",
        "504": "网络超时",
        "505": "http版本不支持该请求",
    };

    const message = networkErrMap[errStatus]

    if(!message){
        return
    }

    if(_.isFunction(message)){
        message()
    }

    if(_.isString(message)){
        toast.error(message)
    }
};

```

