import firebase from "firebase/app";

export default {
    state: {
        categories: []
    },
    actions: {
        async createCategory({commit, dispatch}, {title, limit}) {
            try {
                const uid = await dispatch('getUid'); // getUid - method in auth.js
                const category = await firebase.database().ref(`/users/${uid}/categories`).push({title,limit});
                //  файрбейз возвращает объект где поля нашей категории +  некий ключ key
                //  возвратим это в вызов  ( CreateCategory.vue )
                commit('addCategory', {title, limit, id:category.key});
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
                commit('updateCategory', {id, title, limit});
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
                const catArray = Object.keys(categories).map(key => ({...categories[key], id: key}));
                commit('setCategories', catArray);
                return catArray;
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
        },

        async deleteCategory({commit, dispatch}, id) {
            try {
                const uid = await dispatch('getUid');
                const res = await firebase.database().ref(`/users/${uid}/categories`).child(id).remove();
                commit('removeCategoryByID',id);
                return res;
            }
            catch (e) {
                commit('setError', e); // обработчик ошибок в store.js
                throw e
            }
        }

    },
    mutations: {
        setCategories(state, categories) {
            state.categories = categories;
        },
        addCategory(state, {id, title, limit}) {
            state.categories.push({id, title, limit});
        },
        updateCategory(state, {id, title, limit}) {
            const i = state.categories.findIndex(c => c.id === id);
            state.categories[i] = {id, title, limit};
        },
        removeCategoryByID(state,id) {
            const ind = state.categories.findIndex(k => k.id === id);
            state.categories.splice(ind, 1);

           // console.log(state.categories)
        }
    },
    getters: {
        categories: s => s.categories,
    }
}
