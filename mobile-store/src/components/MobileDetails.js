import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { fetchMobiles } from '../redux';
import './styles.css';
import { updateCart } from '../redux';

class MobileDetailsComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            mobileDetails: null
        }
    }

    componentDidMount() {
        if (this.props.mobileData.mobiles.length == 0) {
            this.props.fetchMobiles();
       // }

       // if (this.props.mobileData.mobiles.length == 0) {
            setTimeout(() => {
                if (!this.props.mobileData.loading && this.props.mobileData.mobiles.length > 0 && this.state.mobileDetails == null) {
                    let mobileInfo = this.props.mobileData.mobiles.find(mobile => mobile.id == this.props.match.params.id);
                    this.setState({
                        ...this.state,
                        mobileDetails: mobileInfo
                    });
                }
            }, 1500);
        }
        else{
            if (!this.props.mobileData.loading && this.props.mobileData.mobiles.length > 0 && this.state.mobileDetails == null) {
                let mobileInfo = this.props.mobileData.mobiles.find(mobile => mobile.id == this.props.match.params.id);
                this.setState({
                    ...this.state,
                    mobileDetails: mobileInfo
                });
            }
        }
    }

    snackbarFunction1() {
        var x = document.getElementById("snackbar");
        x.innerHTML = "Please login to add product to your cart!";
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }

    snackbarFunction2() {
        var x = document.getElementById("snackbar");
        x.innerHTML = "Mobile added to cart!";
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }

    addToCart = (userId, mobileId) => {

        if (!userId) {
            this.snackbarFunction1();
        }
        else {
            this.snackbarFunction2();
            var tempCart = this.props.cartData.cart;
            var cartIndex = 0;
            var isProductAlreadyInCart = false;

            for (var i = 0; i < tempCart.length; i++) {
                if (tempCart[i]["userId"] == userId) {
                    cartIndex = i;
                    for (var j = 0; j < tempCart[i]["mobilesQtyMapper"].length; j++) {
                        if (tempCart[i]["mobilesQtyMapper"][j]["mobileId"] == mobileId) {
                            tempCart[i]["mobilesQtyMapper"][j] = { "mobileId": mobileId, "quantity": tempCart[i]["mobilesQtyMapper"][j]["quantity"] + 1 };
                            isProductAlreadyInCart = true;
                            break;
                        }
                    }
                }
            }

            if (!isProductAlreadyInCart) {
                for (var k = 0; k < tempCart.length; k++) {
                    if (tempCart[k]["userId"] == userId) {
                        tempCart[k]["mobilesQtyMapper"].push({ "mobileId": mobileId, "quantity": 1 });
                    }
                }
            }

            var cartTotal = this.findCartTotal();
            tempCart[cartIndex]["cartTotal"] = cartTotal;
            this.props.updateCart(tempCart);
        }

    }

    findCartTotal = () => {

        var cartTotal = 0;
        var cartId = localStorage["userId"];

        for (var i = 0; i < this.props.cartData.cart.length; i++) {
            if (this.props.cartData.cart[i]["cartId"] == cartId) {
                for (var j = 0; j < this.props.cartData.cart[i]["mobilesQtyMapper"].length; j++) {
                    var mobileInfo = this.props.mobileData.mobiles.find(mobile => mobile.id === this.props.cartData.cart[i]["mobilesQtyMapper"][j]["mobileId"]);
                    cartTotal += this.props.cartData.cart[i]["mobilesQtyMapper"][j]["quantity"] * mobileInfo.price;
                }
            }
        }
        return cartTotal;
    }

    render() {
        const { mobileDetails } = this.state

        return (
            <div className="container mobile-details-main">
                <div id="snackbar"></div>
                {
                    mobileDetails != null ?
                        <div className="mobile-details-outer row">
                            <div className="mobile-details-image-div col-md-4">
                                <img className="mobile-details-image" src={mobileDetails.imageUrl} alt="" />
                            </div>
                            <div className="mobile-details-div col-md-4">
                                <h3><p id="mobile-name">{mobileDetails.name}</p></h3>
                                <p id="mobile-price"><b>Price:</b>&nbsp;${mobileDetails.price}</p>
                                <p id="mobile-model"><b>Model:</b>&nbsp;{mobileDetails.model}</p>
                                <p id="mobile-colors"><b>Colors:</b>&nbsp;{mobileDetails.colors}</p>
                                <p id="mobile-screensize"><b>Screen Size:</b>&nbsp;{mobileDetails.screenSize}</p>
                                <p id="mobile-os"><b>OS:</b>&nbsp;{mobileDetails.os}</p>
                                <p id="mobile-ram"><b>RAM:</b>&nbsp;{mobileDetails.ram}</p>
                                <p id="mobile-storage"><b>Storage:</b>&nbsp;{mobileDetails.storage}</p>
                            </div>
                            <div className="mobile-details-addtocart-div col-md-2">
                                <button className="btn btn-primary" onClick={() => this.addToCart(localStorage["userId"], mobileDetails.id)}>Add to Cart</button>
                            </div>
                        </div>
                        : <p></p>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        mobileData: state.mobile,
        cartData: state.cart
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchMobiles: () => dispatch(fetchMobiles()),
        updateCart: (updatedCart) => dispatch(updateCart(updatedCart))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MobileDetailsComponent))

