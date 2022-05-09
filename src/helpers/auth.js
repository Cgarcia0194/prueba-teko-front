import { storage } from "./api";

const state = {
    user: null,
    init: false,
    token: undefined
};

export default () => {

    state.token = storage.get('token');
    state.user = storage.get('user');

    function login(token, user) {
        storage.set('token', token);
        storage.set('user', user);
    }

    function setUser(user) {
        storage.set('user', user);
    }

    function logout() {
        storage.clear();
    }

    return { state, login, setUser, logout };
}