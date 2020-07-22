import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchMobiles } from '../redux';
import MobileItem from './MobileItem';
import './styles.css';
import Pagination from "react-js-pagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faSearch } from '@fortawesome/free-solid-svg-icons';

export class HomeComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activePage: 1,
            itemsPerPage: 10,
            productsToDisplay: [],
            searchText: ''
        }
    }

    fetchMobilesListForFirstPage() {
        var mobilesToDisplay = this.props.mobileData.mobiles.filter((mobile) => mobile.id >= 1 && mobile.id <= this.state.itemsPerPage);

        this.setState({
            ...this.state,
            productsToDisplay: mobilesToDisplay
        })
    }

    handlePageChange(pageNumber) {
        var productsPart = [];
        var startIndex = (pageNumber - 1) * (this.state.itemsPerPage);
        var endIndex = (pageNumber * this.state.itemsPerPage) - 1;

        for (var i = startIndex; i <= endIndex; i++) {
            if (this.props.mobileData.mobiles[i] != null) {
                productsPart.push(this.props.mobileData.mobiles[i]);
            }
        }

        this.setState({
            ...this.state,
            activePage: pageNumber,
            productsToDisplay: productsPart
        });
    }

    componentDidMount() {
        if (this.props.mobileData.mobiles.length == 0) {
            this.props.fetchMobiles();
      //  }

       // if (this.props.mobileData.mobiles.length == 0) {
            setTimeout(() => {
                if (this.state.productsToDisplay.length == 0 && this.props.mobileData && !this.props.mobileData.isLoading && this.props.mobileData.mobiles != null) {
                    this.fetchMobilesListForFirstPage();
                }
            }, 1500);
        }
        else{
            if (this.state.productsToDisplay.length == 0 && this.props.mobileData && !this.props.mobileData.isLoading && this.props.mobileData.mobiles != null) {
                this.fetchMobilesListForFirstPage();
            }
        }
    }

    searchProducts = (event) => {

        if (event.target.value == '') {
            this.fetchMobilesListForFirstPage();
        }
        else {
            var filteredProducts = this.props.mobileData.mobiles.filter(item => item.name.toLowerCase().includes(event.target.value.toLowerCase()));

            this.setState({
                ...this.state,
                searchText: event.target.value,
                productsToDisplay: filteredProducts
            });
        }
    }

    sortLowToHigh = () => {
        var mobilesCollection = this.state.productsToDisplay;
        mobilesCollection.sort((item1, item2) => (item1.price - item2.price));
        this.setState({
            ...this.state,
            productsToDisplay: mobilesCollection
        });
    }

    sortHighToLow = () => {
        var mobilesCollection = this.state.productsToDisplay;
        mobilesCollection.sort((item1, item2) => (item2.price - item1.price));
        this.setState({
            ...this.state,
            productsToDisplay: mobilesCollection
        });
    }

    render() {
        const { mobileData, fetchMobiles, searchText } = this.props

        return (
            <div className="container home-main">
                <marquee className="scroll-text">Everything you need, delivered safe. We care for you and are here for you. #ShopFomHome #StaySafe</marquee><br /><br />
                <div className="home-toppanel row mx-auto">
                    <div>
                        <form>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
                                </div>
                                <input type="text" name="searchText" value={searchText} onChange={this.searchProducts} className="form-control" placeholder="Search mobiles" />
                            </div>
                        </form>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;
                    <div>
                        <label id="home-sort-label">Sort:</label>&nbsp;
                        <button onClick={this.sortLowToHigh} title="sort Low to High"><FontAwesomeIcon icon={faArrowUp} /></button>
                        <button onClick={this.sortHighToLow} title="sort High to Low"><FontAwesomeIcon icon={faArrowDown} /></button>
                    </div>
                </div>

                <div className="mobilesList row mb-3">
                    {
                        this.state.productsToDisplay.map(mobile => <MobileItem key={mobile.id} mobileDetails={mobile} />)
                    }
                </div>
                <div className="pagination">
                    <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.itemsPerPage}
                        totalItemsCount={mobileData.mobiles.length}
                        pageRangeDisplayed={5}
                        onChange={this.handlePageChange.bind(this)}
                        itemClass="page-item"
                        linkClass="page-link"
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        mobileData: state.mobile
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchMobiles: () => dispatch(fetchMobiles())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent)
