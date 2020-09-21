<template>

    <div>
        <div class="page-title">
            <h3>История записей</h3>
        </div>

        <div class="history-chart">
            <canvas ref="canvas"></canvas>
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
    import {Pie} from 'vue-chartjs'

    export default {
        name: "history",
        components: { HistoryTable },
        mixins: [PaginationMixin],
        extends: Pie,
        data: () => ({
            loading: true,
            records: []
        }),
        async mounted() {
            this.records = await this.$store.dispatch('fetchRecords');
            //const records   = await this.$store.dispatch('fetchRecords');
            const categories = await this.$store.dispatch('fetchCategories');

            this.setup(categories);

            this.loading = false;
        },
        methods: {
            setup(categories) {
                this.setupPagination(this.records.map(record => {
                    return {
                        ...record,
                        categoryName: categories.find(c => c.id === record.categoryID).title,
                        typeClass: record.type === 'income' ? 'green' : 'red',
                        typeText:  record.type === 'income' ? 'Доход' : 'Расход',

                    }
                }));

                this.renderChart(
                    {
                        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        labels: categories.map(c => c.title),
                        datasets: [{
                            label: 'Расходы по категориям',
                            data: categories.map(c => {
                                return this.records.reduce((total,r) => {
                                    if( r.categoryID === c.id && r.type === 'outcome' ) {
                                        total += r.amount;
                                    }
                                    return total
                                },0);
                            }),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.3)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.12)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(25, 159, 84, 0.25)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(25, 159, 84, .8)'
                            ],
                            borderWidth: .2
                        }]
                    },
                    {} // options
                );
                //renderChart END
            }
        },


    }
</script>

<style scoped lang="scss">

</style>
