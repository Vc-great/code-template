import {getToken} from '@/utils/auth'
import Taro from '@tarojs/taro'

import {AxiosError, AxiosRequestConfig, type AxiosResponse, InternalAxiosRequestConfig} from 'axios'

export interface CustomAxiosResponse extends AxiosResponse {
    isError: boolean
}

export function handleRequestChangeRequestHeader(config: AxiosRequestConfig) {
    if (!config.headers) {
        return config
    }
    config.headers.Authorization = getToken()
    return config
}



export function isRequestError(response:AxiosResponse) {
    const isBusinessError = handleBusinessError(response)
    const isHttpError = handleHttpError(response)
    return isBusinessError || isHttpError
}


export function handleBusinessError(response: AxiosResponse): boolean {
    //有code 并且code 不在200-300之间 为异常
    return response.data?.code >= 200 && response.data?.code < 300
}

export function handleHttpError(response: AxiosResponse): boolean {
    return response.status >= 200 && response.status < 300
}

export function showMessage(isRequestError:boolean,message: string = '') {
    isRequestError&& Taro.showToast({
        title: message,
        icon: 'error',
        duration: 2000
    })
}



export const getNetworkErrorTitle = (errStatus?: number): string => {
    const networkErrMap: any = {
        "400": "错误的请求",
        "401": "未授权，请重新登录",
        "403": "拒绝访问",
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
   return errStatus?networkErrMap[errStatus] : ''
}

//error.response.data.message
export function handleNetWorkError401(error:AxiosError) :void {
    //没有登陆 跳转到login
    //展示消息
}

export function handleNetWorkError403(error:AxiosError):void  {
    //没有访问权限 跳转到403页面或登陆页
    //展示消息
}



export function otherErrorHandle(error:AxiosError):void {
    //展示消息
}
