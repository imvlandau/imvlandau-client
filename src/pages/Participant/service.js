import http from "../../services/http";

const ParticipantService = {
  createParticipant({ params }) {
    return new Promise((resolve, reject) => {
      http
        .post("/participant/create", params, {
          responseType: "blob"
        })
        .then(response => {
          resolve(URL.createObjectURL(response.data));
        })
        .catch(response => {
          var reader = new FileReader();
          reader.addEventListener("loadend", () =>
            reject(JSON.parse(new TextDecoder().decode(reader.result)))
          );
          reader.readAsArrayBuffer(
            response && response.response && response.response.data
          );
        });
    });
  },
  deleteParticipant(id) {
    return new Promise((resolve, reject) => {
      http
        .delete(`/participant/delete/${id}`)
        .then(resolve)
        .catch(reject);
    });
  }
};

export default ParticipantService;
