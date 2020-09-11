<template>

    <div>
        <div class="page-title">
            <h3>Категории</h3>
        </div>

        <section>
            <loader v-if="loading" />
            <div class="row" v-else>
                <div class="col s12 m6">

                    <category-create @created="addNewCategory" />

                </div>
                <div class="col s12 m6">

                    <category-edit />

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
        data: () => ({
            categories: [],
            loading: true
        }),
        components: { CategoryEdit, CategoryCreate },
        async mounted() {
            this.categories = await this.$store.dispatch('fetchCategories');
            this.loading = false;
            console.log( this.categories );
        },
        methods: {
            addNewCategory(category) {
                this.categories.push(category);
            }
        }

    }
</script>

<style scoped>

</style>
