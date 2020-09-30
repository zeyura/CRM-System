import firebase from "firebase/app";

export default {
    state: {
        records: []
    },
    actions: {
        async createRecord({commit, dispatch}, record) {
            try {
                const uid = await dispatch('getUid');
                const res = await firebase.database().ref(`/users/${uid}/records`).push(record);
                commit('addRecord',{...record, id:res.key});
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
                const recArray = Object.keys(records).map(key => ({...records[key], id: key}));
                commit('setRecords', recArray);
                return recArray;
            } catch (e) {
                commit('setError', e);
                throw e
            }
        },

        async fetchRecordByID({commit, dispatch}, id) {
            try {
                const uid = await dispatch('getUid');
                const record = (await firebase.database().ref(`/users/${uid}/records`).child(id).once('value')).val() || {};
                return {...record, id}; // id: id <
            } catch (e) {
                commit('setError', e);
                throw e
            }
        },

        async removeRecord({commit, dispatch}, id) {
            try {
                const uid = await dispatch('getUid');
                const res = await firebase.database().ref(`/users/${uid}/records`).child(id).remove();
                if( !res ) commit('delRecordByID', id);
                return res;
            } catch (e) {
                commit('setError', e);
                throw e
            }
        },

    },
    mutations: {
        setRecords(state, records) {
            state.records = records;
        },
        addRecord(state, record) {
            state.records.push(record);
           // console.log(state.records)
        },
        delRecordByID(state, id) {
            const ind = state.records.findIndex(r => r.id === id);
            state.records.splice(ind,1);
        },
        clearRecords(state) {
            state.records = [];
        }
    },
    getters: {
        records: s => s.records,

    }
}
