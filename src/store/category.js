import firebase from "firebase/app";

export default {
    state: {

    },
    actions: {
        async createCategory({commit, dispatch}, {title, limit}) {
            try {
                const uid = await dispatch('getUid'); // getUid - method in auth.js
                const category = await firebase.database().ref(`/users/${uid}/categories`).push({title,limit});
                //  файрбейз возвращает объект где поля нашей категории +  некий ключ key
                //  возвратим это в вызов  ( CreateCategory.vue )
                return {title, limit, id:category.key}
            } catch (e) {
                commit('setError', e); // обработчик ошибок в store.js
                throw e
            }
        }
    },
    mutations: {

    },
    getters: {

    }
}
