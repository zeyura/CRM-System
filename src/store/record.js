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
        async fetchRecords({commit, dispatch}) {
            try {
                const uid = await dispatch('getUid');
                const records = (await firebase.database().ref(`/users/${uid}/records`).once('value')).val() || {};
                return Object.keys(records).map(key => ({...records[key], id: key}));
            } catch (e) {
                commit('setError', e); // обработчик ошибок в store.js
                throw e
            }
        },

        async fetchRecordByID({commit, dispatch}, id) {
            try {
                const uid = await dispatch('getUid');
                const record = (await firebase.database().ref(`/users/${uid}/records`).child(id).once('value')).val() || {};
                return {...record, id}; // id: id <
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
