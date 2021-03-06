import React, { Component } from "react";
import { BrowserRouter as Switch, Route, Link, Redirect } from "react-router-dom";

// import SignUp from "./containers/Home/SignUp";
// import SignIn from "./containers/Home/SignIn";
import ForVendor from "./containers/LandingPage/ForVendor";
import ForUser from "./containers/LandingPage/ForUser";
import Results from "./containers/LandingPage/Results";


import Profile from "./containers/Profile/UserProfile";


import Settings from "./components/UserSettings/Settings"

import FeedDeals from "./containers/Deals";
import DealItem from "./containers/Deals/DealItem";

// import Layout from "./components/Layout";


import "./App.css";

class App extends Component {
  render() {
    return (
        <Switch>
          <div className="fullHeight">
            {/* <Layout /> */}
              {/* <Route exact path="/" component={SignIn} />
              <Route exact path="/SignUp" component={SignUp} /> */}
              <Route exact path="/" component={ForUser} />
              <Route exact path="/vendor" component={ForVendor} />
              <Route exact path="/results" component={Results} />



              <Route exact path="/profile" component={Profile} />


              <Route exact path ="/settings" component={Settings} />
              <Route exact path="/crypto" component={Crypto} />



              <Route exact path="/feed/deals" component={FeedDeals} />
              <Route path='/feed/deals/:deal_name' component={DealItem}/>


              {/* this will redirect none of the matched above Routes to the root route (when not logged in root route is sign in page and when logged in root route is deals page)  */}
              {/* additionally when not logged in this will not allow user to access any sites other than sign in or sign up */}

              {/* need for login */}
              {/* <Redirect to="/"/> */}

            {/* <Layout /> */}
          </div>
        </Switch>
    );
  }
}

export default App;
