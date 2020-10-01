import firebase from 'firebase/app'

export default {
    state: {
        info: {}
    },
    actions: {
        async fetchInfo({dispatch, commit}) {
            const uid = await dispatch('getUid'); // getUid - method in auth.js
            try {
                const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val();
                commit('setInfo', info);
            } catch (e) {
                commit('setError',e);
                throw e;
            }
        },
        async updateInfo({dispatch, commit, getters}, toUpdate) {
            const uid = await dispatch('getUid'); // getUid - method in auth.js
            try {
                const data = {...getters.info, ...toUpdate};
                await firebase.database().ref(`/users/${uid}/info`).update(data);
                commit('setInfo', data);
            } catch (e) {
                commit('setError',e);
                throw e;
            }
        }
    },
    mutations: {
        setInfo(state, info) {
            state.info = info;
        },
        clearInfo(state) {  //  clear info on  Logout
            state.info = {};
        }
    },
    getters: {
        info: s => s.info,
    }
}
