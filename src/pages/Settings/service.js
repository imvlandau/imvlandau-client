import http from "../../services/http";

const SettingsService = {
  saveSettings({ params }) {
    return new Promise((resolve, reject) => {
      http
        .post("/settings/save", params)
        .then(resolve)
        .catch(reject);
    });
  },
  fetchSettings() {
    return new Promise((resolve, reject) => {
      http.get('/settings/fetch')
        .then(resolve)
        .catch(reject);
    });
  }
};

export default SettingsService;
