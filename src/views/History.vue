<template>

    <div>
        <div class="page-title">
            <h3>{{'historyTitle' | localize}}</h3>
        </div>

        <div class="history-chart" v-if="records.length">
            <canvas ref="canvas"></canvas>
        </div>

        <section>

            <loader v-if="loading" />
            <p class="center" v-else-if="!records.length">{{'noRecords' | localize}}. <router-link to="/record">{{'addRecords' | localize}}</router-link> </p>
            <HistoryTable
                v-else
                :records='items'
            />

            <Paginate
                    v-if="!showAllinPage && records.length > pageSize"
                    v-model="page"
                    :page-count='pageCount'
                    :click-handler="pageChangeHandler"
                    :prev-text="prev"
                    :next-text="next"
                    :container-class="'pagination'"
                    :page-class="'waves-effect'"
            >
            ></Paginate>

            <div v-if="!showAllinPage && records.length > pageSize">
                <a @click.prevent="showAllItems" style="cursor: pointer">{{'showAll' | localize}}</a>
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
            records: [],
            income: 'income',
            outcome:'outcome',
            prev: 'Prev',
            next: 'Next'
        }),
        async mounted() {
            this.records = await this.$store.dispatch('fetchRecords');
            //const records   = await this.$store.dispatch('fetchRecords');
            const categories = await this.$store.dispatch('fetchCategories');

            this.loading = false;

            if( this.$store.getters.info.locale === 'ru-RU' ) {
                this.income  = "Доход";
                this.outcome = 'Расход';
                this.prev = 'Назад';
                this.next = 'Вперед'
            }

            this.setup(categories);

        },
        methods: {
            setup(categories) {
                this.setupPagination(this.records.map(record => {
                    return {
                        ...record,
                        categoryName: categories.find(c => c.id === record.categoryID).title,
                        typeClass: record.type === 'income' ? 'green' : 'red',
                        typeText:  record.type === 'income' ? this.income : this.outcome,

                    }
                }));

                // https://www.chartjs.org/docs/latest/charts/doughnut.html#styling
                //   https://vue-chartjs.org/ru/guide/
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
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(54, 162, 235, 0.4)',
                                'rgba(25, 159, 84, 0.45)',
                                'rgba(255, 206, 86, 0.4)',
                                'rgba(75, 200, 192, 0.45)',
                                'rgba(153, 102, 255, 0.4)',
                                'rgba(255, 159, 64, 0.4)',

                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(25, 159, 84, .9)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',

                            ],
                           // backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            borderWidth: .1,
                            hoverBorderWidth: .75,
                           // borderAlign: 'inner'
                        }]
                    },
                    {
                        cutoutPercentage: 50, // default 0
                        circumference: 1.96 * Math.PI, // default 2 * Math.PI
                        rotation: -.5 * Math.PI,
                        animation: {
                            animateRotate: true,
                            animateScale:  true
                        },

                    } // options
                );
                //renderChart END
            }
        },
        created() {

        }

    }
</script>

<style scoped lang="scss">

    .history-chart {
        margin: 30px auto;
    }

</style>
