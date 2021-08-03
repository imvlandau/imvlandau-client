import http from '../../services/http';

const ParticipantsService = {
  deleteParticipant({id}) {
    return new Promise((resolve, reject) => {
      http.delete(`participant/delete/${id}`)
        .then(resolve)
        .catch(reject);
    });
  },
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
