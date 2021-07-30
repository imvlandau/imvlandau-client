import http from '../../services/http';

const ParticipantsService = {
  fetchParticipants() {
    return new Promise((resolve, reject) => {
      http.get('/participants/fetch')
        .then(resolve)
        .catch(reject);
    });
  }
};

export default ParticipantsService;
