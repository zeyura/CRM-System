<template>

    <div>
        <div class="page-title">
            <h3>{{'planningTitle' | localize}} <small>({{'consumptionCategory' | localize}})</small></h3>
            <h4 class="currency-header">{{info.bill | currency('RUB')}}</h4>
        </div>

        <loader v-if="loading" />
        <p class="center" v-else-if="!categories.length">{{'noCategories' | localize}}. <router-link to="/categories">{{'addCategory' | localize}}</router-link> </p>
        <section v-else>
            <div v-for="c of Categories" :key="c.id">
                <p>
                    <strong>{{c.title}}</strong>
                    {{c.spend | currency}} {{'of' | localize}} {{c.limit | currency}}
                </p>
                <div class="progress" v-tooltip="c.tooltip" data-position="top">
                    <div
                            class="determinate "
                            :class="[c.progressColor]"
                            :style="{width: c.progress + '%' }"
                    ></div>
                </div>
            </div>
        </section>
    </div>

</template>

<script>
    import {mapGetters} from 'vuex'
    import currencyFilter from '@/filters/currency.filter'
    export default {
        name: "planning",
        metaInfo() { // vue-meta plugin
            return {
                title: this.$title('planningTitle'),
                htmlAttrs: {
                    lang: this.$lang('lang')
                }
            }
        },
        data: () => ({
            loading: true,
            Categories: [],
            Locale: ''
        }),
        async mounted() {
            let records = [], categories = [];
            if( this.records.length ) {
                records = this.records;
            } else {
                records = await this.$store.dispatch('fetchRecords');
            }

            if( this.categories.length ) {
                categories = this.categories;
            } else {
                categories = await this.$store.dispatch('fetchCategories');
            }

           // const categories = await this.$store.dispatch('fetchCategories');

            this.Locale = this.info.locale;

            this.Categories  = categories.map( c => {
                 const spend = records
                     .filter(r => r.categoryID === c.id)
                     .filter(r => r.type === 'outcome')
                     .reduce((b,r) => {
                         return b += +r.amount;
                     },0);

                 const percent  = 100 * spend / c.limit;
                 const progress = percent > 100 ? 100 : percent;
                 const progressColor = percent < 80 ? 'green' : percent <= 100 ? 'yellow' : 'red';

                 const tooltipDiff = c.limit - spend;

                  let tooltip = '';

                  if( this.Locale === 'ru-RU' ) {
                      tooltip = `${tooltipDiff < 0 ? 'Превышение на' : 'Осталось'} ${currencyFilter(Math.abs(tooltipDiff))}`;
                  } else if( this.Locale === 'en-US' ) {
                      tooltip = `${tooltipDiff < 0 ? 'Excess by' : 'Left'} ${currencyFilter(Math.abs(tooltipDiff))}`;
                  }

                  return {
                      ...c,
                      progress,
                      progressColor,
                      spend,
                      tooltip
                  }
              });

            this.loading = false;
        },
        computed: {
            ...mapGetters(['info', 'records', 'categories']), // get Info from Firebase
        },

    }
</script>

<style scoped>
    @media (max-width: 900px) {
        .page-title {
            display: block;
        }
        .currency-header {
            margin: 18px 0 8px;
        }

    }
</style>
