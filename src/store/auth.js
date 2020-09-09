import firebase from 'firebase/app'

export default {
    actions: {
        async register({dispatch}, {email, password, name}) {
            console.log( name )
            try { // success
                await firebase.auth().createUserWithEmailAndPassword(email, password);
                const uid = await dispatch('getUid');
                await firebase.database().ref(`users/${uid}/info`).set({
                    bill: 1000, // начальный счет денег  бабло )
                    name       //  name: name
                });
            } catch (e) { //  errors

            }
        },
        async login({dispatch, commit}, {email, password}) {
            try { // success
                await firebase.auth().signInWithEmailAndPassword(email, password);
            } catch (e) { //  errors

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
