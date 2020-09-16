import firebase from "firebase/app";

export default {
    state: {

    },
    actions: {
        async createRecord({commit, dispatch}, record) {
            try {

                const uid = await dispatch('getUid');
                const res = await firebase.database().ref(`/users/${uid}/records`).push(record);
                return res;
            } catch (e) {
                commit('setError', e); // обработчик ошибок в store.js
                throw e
            }
        },


    },
    mutations: {

    },
    getters: {

    }
}
