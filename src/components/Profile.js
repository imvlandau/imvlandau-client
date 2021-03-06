import React, { Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { loading, user, ...props } = useAuth0();

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <img src={user.picture} alt="Profile" />

      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </Fragment>
  );
};

export default Profile;
