import React, { Component } from 'react'
import './styles.css';
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { updateCart } from '../redux';

class CartComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            mobiles: [],
            cartDetails: {},
            redirectToLogin: false,
            redirectToHome: false
        }
    }

    componentDidMount() {

        if (!localStorage["userId"]) {
            //redirectToLogin to login page
            this.setredirectToLogin();
        }
        else {
            let cartDetails = this.props.cartData.cart.find(cartItem => cartItem.userId == localStorage.getItem('userId'));
            console.log(cartDetails);
            this.setState({
                ...this.state,
                mobiles: this.props.mobileData.mobiles,
                cartDetails: cartDetails,
            });    
        }
    }

    setredirectToLogin = () => {
        this.setState({
            redirectToLogin: true
        })
    }

    setredirectToHome = () => {
        this.setState({
            redirectToHome: true
        })
    }

    findCartTotal = (userId, cartsCollection) => {
        var cartTotal = 0;

        for (var i = 0; i < cartsCollection.length; i++) {
            if (cartsCollection[i]["userId"] == userId) {
                for (var j = 0; j < cartsCollection[i]["mobilesQtyMapper"].length; j++) {

                    //Find mobile price from mobiles []
                    var mobileInfo = this.props.mobileData.mobiles.find(mobile => mobile.id === cartsCollection[i]["mobilesQtyMapper"][j]["mobileId"]);
                    cartTotal += cartsCollection[i]["mobilesQtyMapper"][j]["quantity"] * mobileInfo.price;
                }
            }
        }
        console.log("cart total " + cartTotal);

        return cartTotal;
    }


    removeFromCart = (userId, mobileIdToRemove) => {
        var cartsCollection = this.props.cartData.cart;
        var cartIndex = 0;

        for (var i = 0; i < cartsCollection.length; i++) {
            if (cartsCollection[i]["userId"] == userId) {
                cartIndex = i;
                for (var j = 0; j < cartsCollection[i]["mobilesQtyMapper"].length; j++) {
                    if (cartsCollection[i]["mobilesQtyMapper"][j]["mobileId"] === mobileIdToRemove) {
                        cartsCollection[i]["mobilesQtyMapper"].splice(j, 1); //remove product from cart of its quantity becomes 0
                        break;
                    }
                }
            }
        }


        var cartTotal = this.findCartTotal(userId, cartsCollection);
        cartsCollection[cartIndex]["cartTotal"] = cartTotal;
        this.props.updateCart(cartsCollection);
    }

    emptyCart = () => {
        var cartsCollection = this.props.cartData.cart;
        var cartIndex = 0;

        for (var i = 0; i < cartsCollection.length; i++) {
            if (cartsCollection[i]["userId"] == localStorage["userId"]) {
                cartIndex = i;
                cartsCollection[i]["mobilesQtyMapper"] = [];
            }
        }

        cartsCollection[cartIndex]["cartTotal"] = 0;
        this.props.updateCart(cartsCollection);
    }

    
    placeOrder = () => {
        this.emptyCart();
        var orderId = Math.floor(Math.random() * 1000) + 1;

        alert(`Order placed successfully with order id: #${orderId}`);
        this.setredirectToHome();
    }

    incrementQuantity = (userId, mobileId) => {
        var cartsCollection = this.props.cartData.cart;
        var cartIndex = 0;

        for (var i = 0; i < cartsCollection.length; i++) {
            if (cartsCollection[i]["userId"] == userId) {
                cartIndex = i;

                for (var j = 0; j < cartsCollection[i]["mobilesQtyMapper"].length; j++) {
                    if (cartsCollection[i]["mobilesQtyMapper"][j]["mobileId"] === mobileId) {
                        cartsCollection[i]["mobilesQtyMapper"][j]["quantity"] += 1;
                        break;
                    }
                }
            }
        }

        var cartTotal = this.findCartTotal(userId, cartsCollection);
        cartsCollection[cartIndex]["cartTotal"] = cartTotal;
        this.props.updateCart(cartsCollection);
    }

    decrementQuantity = (userId, mobileId) => {
        var cartsCollection = this.props.cartData.cart;
        var cartIndex = 0;

        for (var i = 0; i < cartsCollection.length; i++) {
            if (cartsCollection[i]["userId"] == userId) {
                cartIndex = i;

                for (var j = 0; j < cartsCollection[i]["mobilesQtyMapper"].length; j++) {
                    if (cartsCollection[i]["mobilesQtyMapper"][j]["mobileId"] === mobileId) {
                        cartsCollection[i]["mobilesQtyMapper"][j]["quantity"] -= 1;
                        if (cartsCollection[i]["mobilesQtyMapper"][j]["quantity"] === 0) {
                            cartsCollection[i]["mobilesQtyMapper"].splice(j, 1); //remove product from cart of its quantity becomes 0
                            break;
                        }
                    }
                }
            }
        }

        var cartTotal = this.findCartTotal(userId, cartsCollection);
        cartsCollection[cartIndex]["cartTotal"] = cartTotal;
        this.props.updateCart(cartsCollection);
    }


    snackbarFunction() {
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");
      
        // Add the "show" class to DIV
        x.className = "show";
      
        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }

    render() {
        const { mobiles, cartDetails } = this.state
        var mobileInfo;

        if (this.state.redirectToLogin) {
            return <Redirect to='/login' />
        }
        else if (this.state.redirectToHome) {
            return <Redirect to='/' />
        }
        else {
            return (
                cartDetails.mobilesQtyMapper && cartDetails.mobilesQtyMapper.length == 0
                    ?
                    <div class="cart-empty-div">
                        <h4>Your cart is empty!</h4>
                    </div>
                    :
                    <div className="cart-div container">
                        <h4>Your cart items</h4><br />
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Device</th>
                                    <th>Model</th>
                                    <th>Quantity</th>
                                    <th>Price($)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cartDetails && mobiles && cartDetails.mobilesQtyMapper && cartDetails.mobilesQtyMapper.map(cartItem => {
                                        mobileInfo = mobiles.find(mobile => mobile.id === cartItem.mobileId)
                                        return (
                                            <tr key={mobileInfo.id}>
                                                <td><img className="cart-mobile-image" src={mobileInfo.imageUrl} alt="" /></td>
                                                <td>{mobileInfo.model}</td>
                                                <td><button className="btn btn-dark" onClick={() => this.decrementQuantity(localStorage["userId"], cartItem.mobileId)}>-</button>&nbsp;&nbsp;&nbsp;{cartItem.quantity}&nbsp;&nbsp;&nbsp;<button className="btn btn-dark" onClick={() => this.incrementQuantity(localStorage["userId"], cartItem.mobileId)}>+</button></td>
                                                <td>{mobileInfo.price}</td>
                                                <td><button className="btn btn-danger" onClick={() => this.removeFromCart(localStorage["userId"], cartItem.mobileId)}>Remove</button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table><br />
                        <div className="cart-total row float-right mx-auto"><h4>Total:&nbsp;&nbsp;&nbsp;&nbsp;${cartDetails.cartTotal}</h4></div><br /><br />
                        <div>
                            <button className="btn btn-success" onClick={this.placeOrder}>Place Order</button>
                        </div>
                    </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        cartData: state.cart,
        mobileData: state.mobile
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateCart: (updatedCart) => dispatch(updateCart(updatedCart))
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CartComponent))

