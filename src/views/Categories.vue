<template>

    <div>
        <div class="page-title">
            <h3>Категории</h3>
        </div>
        <section>
            <div class="row">
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
            categories: []
        }),
        components: { CategoryEdit, CategoryCreate },
        methods: {
            addNewCategory(category) {
                this.categories.push(category);
                console.log( this.categories )
            }
        }

    }
</script>

<style scoped>

</style>
