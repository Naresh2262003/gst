const LocalStorageManager = {
    setOrgId(org_ID) {
        localStorage.setItem("org_ID", org_ID);
    },

    getOrgId() {
        return localStorage.getItem("org_ID");
    },

    setOrg(org) {
        localStorage.setItem("org", JSON.stringify(org));
    },

    getOrg() {
        return JSON.parse(localStorage.getItem("org"));
    },

    getCurrentUserId() {
        return localStorage.getItem("user_ID");
    },

};

export default LocalStorageManager;