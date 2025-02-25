import LocalStorageManager from "./LocalStorageManager";

const JWTManager = {
    setToken(token) {
        localStorage.setItem("token", token);
    },

    getToken() {
        return localStorage.getItem("token");
    },

    decodeToken(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT: The token must have three parts');
        }

        const payload = parts[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
        const decodedPayload = atob(base64);

        try {
            return JSON.parse(decodedPayload);
        } catch (e) {
            throw new Error('Invalid payload: Payload is not valid JSON');
        }
    },

    setCurrentUserId() {
        const token = this.getToken();
        if (!token) {
            return false;
        }

        try {
            const decoded = this.decodeToken(token);
            // Assuming permissions are stored in an array within the 'perm' field in the token payload
            console.log("user_ID", decoded.sub);
            localStorage.setItem("user_ID", decoded.sub);
            return decoded.sub;
        } catch (e) {
            console.error(e);
            return false;
        }

    },
};

export default JWTManager;
//
// // Usage example
// // Set a JWT token
// JWTManager.setToken("your_jwt_token_here");
//
// // Get a JWT token
// const token = JWTManager.getToken();
//
// // Decode a JWT token
// const decoded = JWTManager.decodeToken(token);
//
// // Check for a specific permission
// const hasPermission = JWTManager.checkPermissions("some_permission");
