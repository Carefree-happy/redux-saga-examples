import { Component } from "react"
import Cart from "./Cart"
import ProductList from "./ProductList"

export default class App extends Component {
    render() {
        return (
            <div>
                <h2>Shopping Cart Example</h2>
                <hr />
                <ProductList />
                <hr />
                <Cart />
            </div>
        )
    }
}
