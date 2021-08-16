import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import PmbOverlay from "../components/PmbOverlay";

const PrivateRoute = ({ component, ...args }) => (
  <Route
    component={withAuthenticationRequired(component, {
      onRedirecting: () => <PmbOverlay />,
    })}
    {...args}
  />
);

export default PrivateRoute;
