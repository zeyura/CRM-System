<template>

    <div>
        <div class="page-title">
            <h3>История записей</h3>
        </div>

        <div class="history-chart">
            <canvas></canvas>
        </div>

        <section>

            <loader v-if="loading" />
            <p class="center" v-else-if="!records.length">Записей еще нет. <router-link to="/record">Добавить запись</router-link> </p>
            <HistoryTable
                v-else
                :records='items'
            />

            <Paginate
                    v-if="!showAllinPage"
                    v-model="page"
                    :page-count='pageCount'
                    :click-handler="pageChangeHandler"
                    :prev-text="'Назад'"
                    :next-text="'Вперед'"
                    :container-class="'pagination'"
                    :page-class="'waves-effect'"
            >
            ></Paginate>

            <div v-if="!showAllinPage">
                <a @click.prevent="showAllItems" style="cursor: pointer">Показать все</a>
            </div>

        </section>
    </div>

</template>

<script>
    import PaginationMixin from '@/mixins/pagination.mixin'
    import HistoryTable from '@/components/HistoryTable'

    export default {
        name: "history",
        components: { HistoryTable },
        mixins: [PaginationMixin],
        data: () => ({
            loading: true,
            records: []
        }),
        async mounted() {

            this.records = await this.$store.dispatch('fetchRecords');
            //const records   = await this.$store.dispatch('fetchRecords');
            const categories = await this.$store.dispatch('fetchCategories');

            this.setupPagination(this.records.map(record => {
                return {
                    ...record,
                    categoryName: categories.find(c => c.id === record.categoryID).title,
                    typeClass: record.type === 'income' ? 'green' : 'red',
                    typeText:  record.type === 'income' ? 'Доход' : 'Расход',

                }
            }));

            this.loading = false;
        },
        methods: {

        }

    }
</script>

<style scoped lang="scss">

</style>
