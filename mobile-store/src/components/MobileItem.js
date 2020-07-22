import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { updateCart } from '../redux';
import './styles.css';

class MobileItem extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            
        }
    }

    snackbarFunction1() {
        var x = document.getElementById("snackbar");
        x.innerHTML = "Please login to add product to your cart!";
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }

      snackbarFunction2() {
        var x = document.getElementById("snackbar");
        x.innerHTML = "Mobile added to cart!";
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }
    
    addToCart = (userId, mobileId) => {

        if(!userId){
            this.snackbarFunction1();
        }
        else{
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
    
            console.log(tempCart);
            var cartTotal = this.findCartTotal();
            tempCart[cartIndex]["cartTotal"] = cartTotal;
            this.props.updateCart(tempCart);

        }
    }

    findCartTotal = () => {
 
        var cartTotal = 0;
        var cartId = localStorage["userId"];

        for (var i = 0; i <  this.props.cartData.cart.length; i++) {
            if ( this.props.cartData.cart[i]["cartId"] == cartId) {
                for (var j = 0; j <  this.props.cartData.cart[i]["mobilesQtyMapper"].length; j++) {
                    var mobileInfo = this.props.mobileData.mobiles.find(mobile => mobile.id === this.props.cartData.cart[i]["mobilesQtyMapper"][j]["mobileId"]);
                    cartTotal +=  this.props.cartData.cart[i]["mobilesQtyMapper"][j]["quantity"] * mobileInfo.price;
                }
            }
        }
        console.log("cart total " + cartTotal);
     
        return cartTotal;
    }

    render() {
        const { mobileDetails } = this.props;

        return (
            <div className="mobileItem col-md-4 no-gutters p-4 overflow-hidden flex-md-row mb-4">
                <div id="snackbar"></div>
                <div className="card flex-md-row mb-4 h-md-250 shadow-sm">
                    <div className="card-body d-flex flex-column align-items-start">
                        <b><p className="text-dark mb-2 view-mobile-details-outer"><Link className="view-mobile-details" title="Click to view details" to={`/mobile/${mobileDetails.id}`}>{mobileDetails.name}</Link> </p></b>   
                        <p className="card-text mb-auto">Price: ${mobileDetails.price}</p>
                        <br />
                        <button className="add-to-cart-mobile-item btn btn-primary" onClick={() => this.addToCart(localStorage["userId"], mobileDetails.id)}>Add to Cart</button>
                    </div>
                    <Link className="view-mobile-details" to={`/mobile/${mobileDetails.id}`}><img className="card-img-right flex-auto d-none d-md-block mobile-item-image" data-holder-rendered="true" src={mobileDetails.imageUrl} title="Click to view details"/></Link>
                </div>
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
        updateCart: (updatedCart) => dispatch(updateCart(updatedCart))
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MobileItem))
