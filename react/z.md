# 第一种
```ts
import { immer } from 'zustand/middleware/immer'

import { create } from 'zustand'

interface State {
    token: string
    userInfo: object | null
}

// 定义初始状态
function initialState(isFormCache: boolean = true): State {
    return {
        token: isFormCache ? Taro.getStorageSync('token') : '',
        userInfo: isFormCache ? Taro.getStorageSync('userInfo') || null : null
    }
}

export const useUserStore = create<State>()(
    immer(() => ({
        ...initialState()
    }))
)

const saveToken = (token: State['token']) =>
    useUserStore.setState(state => {
        state.token = token
    })
```
