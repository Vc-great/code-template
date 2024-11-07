import {
     handleNetWorkError401, handleNetWorkError403,
    isRequestError, otherErrorHandle,
    showMessage,
} from './request-interceptors'
import _ from 'lodash-es'
import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import {NetworkErrorHandle} from "./request-error";
import {HttpStatusCode} from "./HttpStatusCode";
import {getToken} from './authorization'
const axiosOptions: AxiosRequestConfig = {
/*    baseURL : import.meta.env.VITE_BASE_API,
    timeout : Number(import.meta.env.VITE_REQUEST_TIME_OUT)*/
    baseURL: process.env.TARO_APP_BASE_API,
    timeout: process.env.requestTimeout |0, //0为无超时时间
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
}

function setInterceptor(instance: AxiosInstance) {
    //instance.interceptors.request.use()

    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            //业务错误 进行消息提示
            //todo
           showMessage(isRequestError(response),response.data.message)
            //其他情况均为正常
            return response.data
        },
        error => {
             new NetworkErrorHandle(error)
                 .addError(HttpStatusCode.Unauthorized,handleNetWorkError401)
                 .addError(HttpStatusCode.Forbidden,handleNetWorkError403)
                 .addOtherErrorHandle(otherErrorHandle)
                 .handle()

            return Promise.reject(error)
        }
    )

    return instance
}

export const request: AxiosInstance = _.flow([setInterceptor])(axios.create(axiosOptions))
