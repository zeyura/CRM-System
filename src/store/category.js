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
        },
        async updateCategory({commit, dispatch}, {id, title, limit}) {
            try {
                const uid = await dispatch('getUid');
                const category = await firebase.database().ref(`/users/${uid}/categories`).child(id).update({title,limit});

            } catch (e) {
                commit('setError', e); // обработчик ошибок в store.js
                throw e
            }
        },
        async fetchCategories({commit, dispatch}) {
            try {
                const uid = await dispatch('getUid'); // getUid - method in auth.js
                const categories = (await firebase.database().ref(`/users/${uid}/categories`).once('value')).val() || {};
                // categories -  у нас объект со страшными ключами категорий, трансформируем его ))
                // ----  2 Вариант -------  Лаконичней  не так ли ))  ------
                return Object.keys(categories).map(key => ({...categories[key], id: key}));
            }
            catch (e) {
                commit('setError', e); // обработчик ошибок в store.js
                throw e
            }
        },

        async fetchCategoryByID({commit, dispatch}, id) {
            try {
                const uid = await dispatch('getUid'); // getUid - method in auth.js
                const category = (await firebase.database().ref(`/users/${uid}/categories`).child(id).once('value')).val() || {};
                return {...category,id};
            }
            catch (e) {
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
