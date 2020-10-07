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
            } catch (e) {
                commit('setError', e);  //  in file store.js
                throw e
            }
        },

        // GOOGLE
        async loginGoogle({dispatch, commit}) {
            let provider = new firebase.auth.GoogleAuthProvider();

            try {
                const res = await firebase.auth().signInWithPopup(provider);

                const uid = await dispatch('getUid');
                const name = res.additionalUserInfo.profile.name;

                await firebase.database().ref(`users/${uid}/info`).set({
                    bill: 1000, // начальный счет денег  бабло )
                    name       //  name: name
                });
            } catch (error) {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
                // The email of the user's account used.
                let email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                let credential = error.credential;

                commit('setError', error);  //  in file store.js
                throw error
            }
        },

        // FACEBOOK
        // https://firebase.google.com/docs/auth/web/facebook-login?authuser=0
        async loginFacebook({dispatch, commit}) {
            let provider = new firebase.auth.FacebookAuthProvider();

            try {
                const res = await firebase.auth().signInWithPopup(provider); // no Redirect
               // console.log(res)
                const uid = await dispatch('getUid');
                const name = res.additionalUserInfo.profile.name;
                const email = res.additionalUserInfo.profile.email;

                await firebase.database().ref(`users/${uid}/info`).set({
                    bill: 1000, // начальный счет денег  бабло )
                    name       //  name: name
                });
            } catch (e) {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
                let email = error.email;
                let credential = error.credential;

                commit('setError', error);
                throw error
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

        async logout({commit}) {
            await firebase.auth().signOut();
            commit('clearInfo');  //  clear state.info in  info.js
        }
    }
}
