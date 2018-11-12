import {combineReducers} from 'redux';
import Deals from './reducer-deals';
import Layout from './reducer-layout';
import Photo from './reducer-photo';

const allReducers = combineReducers({
  matchedDeals: Deals,
  Layout,
  Photo
});

export default allReducers;