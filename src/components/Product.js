import PropTypes from "prop-types"
import { Component } from "react"

export default class Product extends Component {
    render() {
        const { price, quantity, title, action } = this.props
        return (
            <div>
                {title} - &#36;{price} {quantity ? `x ${quantity}` : null} {action}
            </div>
        )
    }
}

Product.propTypes = {
    price: PropTypes.number,
    quantity: PropTypes.number,
    title: PropTypes.string,
    action: PropTypes.node
}
