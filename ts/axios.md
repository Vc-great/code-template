
# request
```ts
import axios from 'axios-miniprogram'
import type { AxiosInstance, AxiosRequestConfig } from 'axios-miniprogram'

import _ from 'lodash-es'

import { setInterceptor } from './request-interceptors'

export const axiosOptions: AxiosRequestConfig = {
    baseURL: process.env.TARO_APP_BASE_API
    // timeout: Number(process.env.TARO_APP_REQUEST_TIME_OUT) || 0 //0为无超时时间
}

export const request: AxiosInstance = _.flow([setInterceptor])(axios.create(axiosOptions))

```

#request-interceptors
```ts
import { TOKEN } from '@/utils/constant'
import { httpStatusCode, networkErrMap } from '@/utils/httpStatusCode'
import { BusinessErrorHandle, NetworkErrorHandle } from '@/utils/requestError'
import { logoutClearStorage } from '@/utils/storage'

import Taro from '@tarojs/taro'

import { inRange } from 'lodash-es'

import { type AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios-miniprogram'

export type ResponseBusinessData = {
    code: number
    msg: string
}

export function setInterceptor(instance: AxiosInstance) {
    instance.interceptors.request.use(config => {
        config = setAuthorization(config)
        return config
    })

    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            //业务错误 进行消息提示
            if (isRequestError(response)) {
                new BusinessErrorHandle(response.data as ResponseBusinessData)
                    .addError(httpStatusCode.Unauthorized, handleNetWorkError401)
                    .addError(httpStatusCode.Forbidden, handleNetWorkError403)
                    .addOtherErrorHandle(otherBusinessErrorHandle)
                    .handle()

                return Promise.reject(response)
            }
            //其他情况均为正常
            return response
        },
        error => {
            new NetworkErrorHandle(error as AxiosResponse).addOtherErrorHandle(otherNetWorkErrorHandle).handle()

            return Promise.reject(error)
        }
    )

    return instance
}

export function setAuthorization(config: AxiosRequestConfig) {
    const token = Taro.getStorageSync(TOKEN)
    config.headers = {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : ''
    }

    return config
}

export function isRequestError(response: AxiosResponse) {
    const data = response.data as ResponseBusinessData
    const isBusinessError = handleBusinessError(data)
    const isNetWorkError = handleNetWorkError(response)
    return isBusinessError || isNetWorkError
}

export function handleBusinessError(response: ResponseBusinessData): boolean {
    //有code 并且code 不在200-300之间 为异常
    return !inRange(response.code, 200, 300)
}

export function handleNetWorkError(response: AxiosResponse): boolean {
    return !inRange(response.status, 200, 300)
}

//
export function handleNetWorkError401(response: ResponseBusinessData): void {
    logoutClearStorage()
    //没有登陆 跳转到login
    Taro.showToast({
        title: '(401)' + response.msg,
        icon: 'none',
        duration: 2000
    })
    setTimeout(() => {
        Taro.reLaunch({
            url: '/pages/start-page/index'
        })
    }, 2000)
}
//
export function handleNetWorkError403(response: ResponseBusinessData): void {
    logoutClearStorage()
    //没有访问权限 跳转到403页面或登陆页

    Taro.showToast({
        title: '(403)' + response.msg,
        icon: 'none',
        duration: 2000
    })
    setTimeout(() => {
        Taro.reLaunch({
            url: '/pages/start-page/index'
        })
    }, 2000)
}

export function otherBusinessErrorHandle(error: ResponseBusinessData): void {
    Taro.showToast({
        title: `(${error.code})` + error.msg || '',
        icon: 'none',
        duration: 2000
    })
}

export function otherNetWorkErrorHandle(error: AxiosResponse): void {
    const message = `(HTTP${error.response.status})${error.response?.data?.errMsg || networkErrMap[error.response.status] || ''}`
    console.log('-> error', error)
    Taro.showToast({
        title: message,
        icon: 'none',
        duration: 2000
    })
}


```

# requestError
```ts
import { ResponseBusinessData } from '@/utils/request-interceptors'
import type { AxiosResponse } from 'axios-miniprogram'
import { isFunction } from 'lodash-es'

type BusinessErrHandle = (err: ResponseBusinessData) => void
type NetworkErrHandle = (err: AxiosResponse) => void

/**
 * 网络错误
 */
export class NetworkErrorHandle {
    private errorHandleMap: Map<number, any> = new Map()
    private otherErrorHandler: NetworkErrHandle | undefined
    constructor(private readonly error: AxiosResponse) {
        this.error = error
    }

    addError(code: number, handle: NetworkErrHandle): NetworkErrorHandle {
        this.errorHandleMap.set(code, handle)
        return this
    }

    addOtherErrorHandle(otherErrorHandler: NetworkErrHandle) {
        this.otherErrorHandler = otherErrorHandler
        return this
    }

    handle() {
        const statusCode = this.error.status
        if (statusCode && this.errorHandleMap.has(statusCode)) {
            const handle = this.errorHandleMap.get(statusCode)
            handle(this.error)
        } else {
            isFunction(this.otherErrorHandler) && this.otherErrorHandler(this.error)
        }
    }
}

/**
 * 业务错误
 */
export class BusinessErrorHandle {
    private errorHandleMap: Map<number, any> = new Map()
    private otherErrorHandler: BusinessErrHandle | undefined

    constructor(private readonly error: ResponseBusinessData) {
        this.error = error
    }

    addError(code: number, handle: BusinessErrHandle): BusinessErrorHandle {
        this.errorHandleMap.set(code, handle)
        return this
    }

    addOtherErrorHandle(otherErrorHandler: BusinessErrHandle): BusinessErrorHandle {
        this.otherErrorHandler = otherErrorHandler
        return this
    }

    handle() {
        const statusCode = this.error.code
        if (statusCode && this.errorHandleMap.has(statusCode)) {
            const handle = this.errorHandleMap.get(statusCode)
            handle(this.error)
        } else {
            isFunction(this.otherErrorHandler) && this.otherErrorHandler(this.error)
        }
    }
}

```
# networkErrMap
```ts
export const networkErrMap = {
    400: '请求参数出错',
    403: '权限不足',
    500: '服务器端出错',
    501: '网络未实现',
    502: '网络错误',
    503: '服务不可用',
    504: '网络超时',
    505: 'http版本不支持该请求'
}
```
# httpCode
```ts
export enum HttpStatusCode {
    Continue = 100,
    SwitchingProtocols = 101,
    Processing = 102,
    EarlyHints = 103,
    Ok = 200,
    Created = 201,
    Accepted = 202,
    NonAuthoritativeInformation = 203,
    NoContent = 204,
    ResetContent = 205,
    PartialContent = 206,
    MultiStatus = 207,
    AlreadyReported = 208,
    ImUsed = 226,
    MultipleChoices = 300,
    MovedPermanently = 301,
    Found = 302,
    SeeOther = 303,
    NotModified = 304,
    UseProxy = 305,
    Unused = 306,
    TemporaryRedirect = 307,
    PermanentRedirect = 308,
    BadRequest = 400,
    Unauthorized = 401,
    PaymentRequired = 402,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    ProxyAuthenticationRequired = 407,
    RequestTimeout = 408,
    Conflict = 409,
    Gone = 410,
    LengthRequired = 411,
    PreconditionFailed = 412,
    PayloadTooLarge = 413,
    UriTooLong = 414,
    UnsupportedMediaType = 415,
    RangeNotSatisfiable = 416,
    ExpectationFailed = 417,
    ImATeapot = 418,
    MisdirectedRequest = 421,
    UnprocessableEntity = 422,
    Locked = 423,
    FailedDependency = 424,
    TooEarly = 425,
    UpgradeRequired = 426,
    PreconditionRequired = 428,
    TooManyRequests = 429,
    RequestHeaderFieldsTooLarge = 431,
    UnavailableForLegalReasons = 451,
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
    HttpVersionNotSupported = 505,
    VariantAlsoNegotiates = 506,
    InsufficientStorage = 507,
    LoopDetected = 508,
    NotExtended = 510,
    NetworkAuthenticationRequired = 511,
}

```
