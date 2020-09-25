<template>

    <div>
        <div class="page-title">
            <h3>{{'categoriesTitle' | localize}}</h3>
        </div>

        <section>
            <loader v-if="loading" />
            <div class="row" v-else>
                <div class="col s12 m6">

                    <category-create @created="addNewCategory" />

                </div>
                <div class="col s12 m6">

                    <category-edit
                        v-if="categories.length"
                        :categories="categories"
                        :key='categories.length + updateCounter'
                        @updated="updateCategory"
                    />
                    <!-- выше :key для динамичного обновления селекта Category-Edit при обновлении категории любой !!  -->

                    <p v-else>{{'noCategories' | localize}}</p>

                </div>
            </div>
        </section>
    </div>

</template>

<script>
    import CategoryCreate from '@/components/CategoryCreate'
    import CategoryEdit from '@/components/CategoryEdit'
    export default {
        name: "categories",
        metaInfo() { // vue-meta plugin
            return {
                title: this.$title('categoriesTitle'),
                htmlAttrs: {
                    lang: this.$lang('lang')
                }
            }
        },
        data: () => ({
            categories: [],
            loading: true,
            updateCounter: 0
        }),
        components: { CategoryEdit, CategoryCreate },
        async mounted() {
            this.categories = await this.$store.dispatch('fetchCategories');
            this.loading = false;
        },
        methods: {
            addNewCategory(category) {
                this.categories.push(category);
            },
            updateCategory(cat) {
                const i = this.categories.findIndex( c => c.id === cat.id);
                this.categories[i].title = cat.title;
                this.categories[i].limit = cat.limit;
                this.updateCounter++
            }
        }

    }
</script>

<style scoped>

</style>
