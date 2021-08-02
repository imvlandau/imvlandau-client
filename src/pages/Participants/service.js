import http from '../../services/http';

const ParticipantsService = {
  setHasBeenScanned({id, hasBeenScanned}) {
    return new Promise((resolve, reject) => {
      http.post(`participant/${id}/setHasBeenScanned`, {hasBeenScanned})
        .then(resolve)
        .catch(reject);
    });
  },
  fetchParticipants() {
    return new Promise((resolve, reject) => {
      http.get('/participants/fetch')
        .then(resolve)
        .catch(reject);
    });
  }
};

export default ParticipantsService;
