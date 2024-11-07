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
