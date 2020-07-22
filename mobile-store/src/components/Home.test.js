import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { HomeComponent } from './Home';
 
describe('Examining the syntax of Jest tests in Home Component', () => {
 
    configure({ adapter: new Adapter() });
 
    it('should render Sort: as text', ()=>{
        const props ={
            fetchMobiles: jest.fn(),
            mobileData: {mobiles:[]},
        }
 
        const wrapper = shallow(<HomeComponent  {...props} />)
        expect(wrapper.find('#home-sort-label').text()).toEqual('Sort:');
    })
 
});