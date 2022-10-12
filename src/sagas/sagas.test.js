import { call, put, select } from "redux-saga/effects"
import * as actions from "../actions"
import { getCart } from "../reducers"
import { checkout, getAllProducts } from "../sagas"
import { api } from "../services"

const products = [1],
    cart = [1] // dummy values
const state = { products, cart }
const getState = () => state

test("getProducts Saga test", () => {
    const generator = getAllProducts(getState)

    expect(generator.next(actions.getAllProducts()).value).toEqual(call(api.getProducts))

    expect(generator.next(products).value).toEqual(put(actions.receiveProducts(products)))
})

test("checkout Saga test", () => {
    const generator = checkout()

    expect(generator.next().value).toEqual(select(getCart))

    expect(generator.next(cart).value).toEqual(call(api.buyProducts, cart))

    expect(generator.next().value).toEqual(put(actions.checkoutSuccess(cart)))
})
