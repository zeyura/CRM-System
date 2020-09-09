import firebase from 'firebase/app'

export default {
    actions: {
        async register({dispatch, commit}, {email, password, name}) {
            try { // success
                await firebase.auth().createUserWithEmailAndPassword(email, password);
                const uid = await dispatch('getUid');
                await firebase.database().ref(`users/${uid}/info`).set({
                    bill: 1000, // начальный счет денег  бабло )
                    name       //  name: name
                });
            } catch (e) { //  errors
               // console.log(e)
                commit('setError', e);  //  in file store.js
                throw e
            }
        },
        async login({dispatch, commit}, {email, password}) {
            try { // success
                await firebase.auth().signInWithEmailAndPassword(email, password);
            } catch (e) { //  errors
                commit('setError', e);
                throw e
            }
        },
        getUid() {
            const user = firebase.auth().currentUser;
            return user ? user.uid : null;
        },

        async logout() {
            await firebase.auth().signOut();
        }
    }
}
