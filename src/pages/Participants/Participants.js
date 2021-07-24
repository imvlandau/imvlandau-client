import React, { useRef } from "react";
import { connect } from "react-redux";
import * as actionCreators from "./actions";

function Participants({ ...props }) {
  const didMountRef = useRef(false);

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      props.fetchParticipants();
      didMountRef.current = true;
    } else {
      // updated
    }
  });

  return (
    <React.Fragment>
      test
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => ({});

export default connect(
  mapStateToProps,
  actionCreators
)(Participants);
