<template>

    <div>
        <div class="page-title">
            <h3>{{'historyTitle' | localize}}</h3>
        </div>

        <div class="chart-wrapper" :class="{'hide': !isOutcome}">
            <div class="page-subtitle" >
                <h5 class="center">{{'chart-title' | localize}}</h5>
            </div>
            <div class="history-chart" >
                <canvas ref="canvas"></canvas>
            </div>
        </div>

        <section style="margin-bottom: 50px">

            <div class="vue-slider-wrap" v-if="records.length && !loading">
                <vue-slider
                        ref="slider"
                        v-model="sliderValue"
                        :tooltip-formatter="formatter"
                        :silent="false"
                        direction="ltr"
                        :min="sliderMin"
                        :max="sliderMax"
                        tooltip="focus"
                        @change="sliderChange"
                        @drag-start="sliderDragStart"
                        @drag-end="sliderDragEnd"
                        @error="sliderError"
                />
                <div class="vue-slider-wrap-info">
                    <span>{{sliderMin}} ₽</span>
                    <span>Фильтр суммы</span>
                    <span>{{sliderMax}} ₽</span>
                </div>
                <button class="btn reset-filter-btn waves-effect waves-light" @click="resetFilter">{{'resetFilter' | localize}}</button>
            </div>

            <loader v-if="loading" />
            <p class="center" v-else-if="!records.length">{{'noRecords' | localize}}. <router-link to="/record">{{'addRecords' | localize}}</router-link> </p>
            <HistoryTable
                v-else
                :records='items'
                :transit="records.length < pageSize + 1"
                @removeRecord="removeRecord"
                @sort="recordsSort"
                @toSum="toSumFilter"
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
                <a @click.prevent="showAllItems" style="cursor: pointer">{{'showAll' | localize}} {{records.length}}</a>
            </div>

        </section>
    </div>

</template>

<script>
    import PaginationMixin from '@/mixins/pagination.mixin'
    import HistoryTable from '@/components/HistoryTable'
    import {Pie} from 'vue-chartjs'

    import VueSlider from 'vue-slider-component'   // https://nightcatsama.github.io/vue-slider-component/
    import 'vue-slider-component/theme/antd.css'   // https://nightcatsama.github.io/vue-slider-component/#/api/props

    export default {
        name: "history",
        metaInfo() { // vue-meta plugin
            return {
                title: this.$title('historyTitle'),
                htmlAttrs: {
                    lang: this.$lang('lang')
                }
            }
        },
        components: { HistoryTable, VueSlider },
        mixins: [PaginationMixin],
        extends: Pie,
        data: () => ({
            loading: true,
            startLoad: true,
            records: [],
            recordsCopy: [],
            categories: [],
            income: 'income',
            outcome:'outcome',
            prev: 'Prev',
            next: 'Next',
            sliderValue: [1, 100],
            formatter: '{value} ₽',
            sliderMin: 0,
            sliderMax: 100,
            sliderDragging: false
        }),
        async mounted() {
            if( this.$store.getters.records.length ) {
                this.records = this.$store.getters.records;
            } else {
                this.records = await this.$store.dispatch('fetchRecords');
            }

            this.categories = await this.$store.dispatch('fetchCategories');

            this.loading = false;

            if( this.$store.getters.info.locale === 'ru-RU' ) {
                this.income  = "Доход";
                this.outcome = 'Расход';
                this.prev = 'Назад';
                this.next = 'Вперед'
            }

            if( this.records.length ) this.setup(this.categories);

            // Slider Worker ----
            let arr = [];
            this.records.forEach(c => {
                arr.push( c.amount )
            });
            this.sliderMin = Math.min( ...arr );
            this.sliderMax = Math.max( ...arr );

            this.sliderValue = [ this.sliderMin, this.sliderMax ];
            arr = [];
            /// Slider END

            this.startLoad = false;

           ///

        },
        computed: {
          isOutcome() {
              return this.records.some(c => c.type === 'outcome');
          }
        },
        methods: {
            sliderChange(v,i) { // очень часто происходят вызовы
                this.filterRecordsBySum();
                if( this.records.length ) this.setup(this.categories);
            },
            sliderDragStart() {
                this.sliderDragging = true;
            },
            sliderDragEnd() {
                this.sliderDragging = false;
            },
            sliderError(type, message) {
               // console.log(message)
            },
            filterRecordsBySum() {
                if(!this.recordsCopy.length) this.recordsCopy = this.records.slice();
                this.records = this.recordsCopy.filter(r => {
                    return (r.amount >= this.sliderValue[0] && r.amount <= this.sliderValue[1]);
                });
            },
            resetFilter() {
                this.sliderValue = [ this.sliderMin, this.sliderMax ];
                this.sliderChange();
            },
            toSumFilter(s) {
                const diff = this.sliderMax - this.sliderMin;
                const radius = diff / 10;
                const min = (s - radius) < this.sliderMin ? this.sliderMin : Math.round(s - radius);
                const max = (s + radius) > this.sliderMax ? this.sliderMax : Math.round(s + radius);
                this.sliderValue = [min, max];
                this.sliderChange();
            },

            async removeRecord(id) {
                try {
                    const res = await this.$store.dispatch('removeRecord', id);
                    if(!res) this.getRecords();

                    if( this.$store.getters.info.locale === 'ru-RU' ) {
                        this.$message(`Запись удалена`);
                    }
                    if( this.$store.getters.info.locale === 'en-US' ) {
                        this.$message(`Record removed`);
                    }
                } catch (e) {}
            },
            getRecords() {
                this.records = this.$store.getters.records;
                if( this.records.length ) this.setup(this.categories);
            },

            recordsSort(numer,type) {
                if(!this.recordsCopy.length) this.recordsCopy = this.records.slice();
                this.recordsCopy.sort( (a,b) => {
                   if(numer === 0) { // по сумме
                        if(type) return +a.amount - +b.amount;
                        else return +b.amount - +a.amount;
                   } else if(numer === 1) { // по дате
                       if(type) return a.date > b.date ? 1 : -1;
                       else return b.date > a.date ? 1 : -1;
                   } else if(numer === 2) { // по категории
                       if(type) return a.categoryID > b.categoryID ? 1 : -1;
                       else return b.categoryID > a.categoryID ? 1 : -1;
                   } else if(numer === 3) { // по типу
                       if(type) return a.type > b.type ? 1 : -1;
                       else return b.type > a.type ? 1 : -1;
                   }
                });
                this.filterRecordsBySum();
                if( this.records.length ) this.setup(this.categories);
            },

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
                if(this.startLoad) this.renderChart(
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
                                'rgba(92, 107, 192, 1)',
                                'rgba(92, 107, 192, 0.8)',
                                'rgba(92, 107, 192, 0.63)',
                                'rgba(92, 107, 192, 0.5)',
                                'rgba(92, 107, 192, 0.35)',
                                'rgba(92, 107, 192, 0.22)',
                                'rgba(92, 107, 192, 0.14)',
                                'rgba(92, 107, 192, 0.075)',

                            ],
                            borderColor: [
                                'rgba(255, 255, 255, .5)',
                                'rgba(255, 255, 255, .5)',
                                'rgba(255, 255, 255, .5)',
                                'rgba(255, 255, 255, .5)',
                                'rgba(255, 255, 255, .5)',
                                'rgba(255, 255, 255, .5)',
                                'rgba(255, 255, 255, .5)',
                                'rgba(255, 255, 255, .5)'
                            ],
                           // backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            borderWidth: 0.1,
                            hoverBorderWidth: .9,
                           // borderAlign: 'inner'
                        }]
                    },
                    {
                        cutoutPercentage: 44, // default 0
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
        }

    }
</script>

<style scoped lang="scss">

    .history-chart {
        margin: 30px auto;
    }

    .vue-slider-wrap {
        width: 300px;
        margin: 60px 5px 40px;
        position: relative;

        &-info {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            padding-top: 5px;
        }

        .reset-filter-btn {
            position: absolute;
            left: 112%;
            top:3px;
        }

        @media (max-width: 600px) {
            .reset-filter-btn {
                position: relative;
                left: 0;
                top:15px;
            }
        }
    }


</style>
