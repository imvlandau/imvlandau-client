import http from '../../services/http';

const ParticipantsService = {
  getParticipants() {
    return new Promise((resolve, reject) => {
      http.get('/attendees/fetch')
        .then(resolve)
        .catch(reject);
    });
  },
  getParticipant(id) {
    return new Promise((resolve, reject) => {
      http.get(`/participant/${id}`)
        .then(resolve)
        .catch(reject);
    });
  },
};

export default ParticipantsService;
