import { incrementAsync } from "."
import { put, delay } from "redux-saga/effects"

jest.setTimeout(20000)

test("some test title", async () => {
    const generator = incrementAsync()
    // delay test1: 模拟延时，获取变量状态，通过变量是否完成定义，判断是否成功
    // const foo = true
    // generator.next()
    // await new Promise((r) => setTimeout(r, 2000))
    // expect(foo).toBeDefined()

    // delay test2: 引用 saga 原生方法
    expect(generator.next().value).toEqual(delay(1000))
    expect(generator.next().value).toEqual(put({ type: "INCREMENT" }))
    expect(generator.next()).toEqual({ value: undefined, done: true })
})
