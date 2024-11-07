
# request
```ts
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
            if(isRequestError(response) ){
                showMessage(response.data.message)
               return Promise.reject(response)
            }
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

```

#request-error
```ts
import {AxiosError} from "axios";
import _ from 'lodash-es'
type ErrHandle = (err: AxiosError) => void;


export class NetworkErrorHandle {
    private errorHandleMap: Map<number, any> =new Map;
   private otherErrorHandler: ErrHandle | undefined;
   constructor(private readonly axiosError: AxiosError) {
       this.axiosError= axiosError
   }

   addError(code:number,handle:ErrHandle):NetworkErrorHandle {
        this.errorHandleMap.set(code,handle);
        return this
   }

  addOtherErrorHandle(otherErrorHandler:ErrHandle){
        this.otherErrorHandler = otherErrorHandler
         return this
  }

    handle(){
       const statusCode = this.axiosError.status
        if(statusCode &&this.errorHandleMap.has(statusCode)){
            const handle = this.errorHandleMap.get(statusCode);
            handle(this.axiosError)
        }else{
           _.isFunction( this.otherErrorHandler)&& this.otherErrorHandler(this.axiosError)
        }
    }
}


export class ResponseErrorHandle {

}

```

#request-interceptors
```ts
import type {AxiosError, AxiosResponse} from 'axios'


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

# backup
```ts
import { handleBusinessError, handleHttpError } from './request-interceptors'
import _ from 'lodash-es'

import axios, { AxiosInterceptorOptions, AxiosRequestConfig } from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

type CustomResponse<T = any> = [T | undefined, T | undefined, AxiosResponse]

interface AxiosInterceptorManager<V> {
    use(
        onFulfilled?: ((value: V) => V | CustomResponse | Promise<V>) | null,
        onRejected?: ((error: any) => any) | null,
        options?: AxiosInterceptorOptions
    ): number
    eject(id: number): void
    clear(): void
}
interface CustomAxiosInstance extends AxiosInstance {
    interceptors: {
        request: AxiosInterceptorManager<InternalAxiosRequestConfig>
        response: AxiosInterceptorManager<AxiosResponse>
    }
}

const axiosOptions: AxiosRequestConfig = {
    baseURL: process.env.TARO_APP_BASE_API,
    timeout: 0
}

function setInterceptor(instance: CustomAxiosInstance) {
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => config,
        error => [error, undefined]
    )
    //
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            const isBusinessError = handleBusinessError(response)
            const isHttpError = handleHttpError(response)
            //todo 错误消息提示

            //其他情况均为正常
            return isBusinessError || isHttpError
                ? [response.data, undefined, response]
                : [undefined, response.data, response]
        },
        error => {
            return [error, undefined]
        }
    )

    return instance
}

export const request: AxiosInstance = _.flow([setInterceptor])(axios.create(axiosOptions))

```
