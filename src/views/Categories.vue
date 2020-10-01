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
                        @deleted="deleteCategory"
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
            let categories = this.$store.getters.categories;

            if( categories.length ) {
                this.categories = categories;
            } else {
                this.categories = await this.$store.dispatch('fetchCategories');
            }

            this.loading = false;
        },
        methods: {
            addNewCategory(category) {
                this.categories.push(category);

                const locale = this.$store.getters.info.locale;
                if( locale === 'ru-RU' ) {
                    this.$message('Категория была создана');
                } else if( locale === 'en-US' ) {
                    this.$message('Category was created');
                }
            },
            updateCategory(cat) {
                const i = this.categories.findIndex( c => c.id === cat.id);
                this.categories[i].title = cat.title;
                this.categories[i].limit = cat.limit;
                this.updateCounter++
            },
            deleteCategory(id) {
                const i = this.categories.findIndex( c => c.id === id);
                this.categories.splice(i,1);
                this.updateCounter = this.updateCounter + 2
            }
        }

    }
</script>

<style scoped>

</style>
