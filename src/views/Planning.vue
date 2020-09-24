<template>

    <div>
        <div class="page-title">
            <h3>{{'planningTitle' | localize}}</h3>
            <h4>{{info.bill | currency('RUB')}}</h4>
        </div>

        <loader v-if="loading" />
        <p class="center" v-else-if="!categories.length">{{'noCategories' | localize}}. <router-link to="/categories">{{'addCategory' | localize}}</router-link> </p>
        <section v-else>
            <div v-for="c of categories" :key="c.id">
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
        data: () => ({
            loading: true,
            categories: [],
            Locale: ''
        }),
        async mounted() {
              const records    = await this.$store.dispatch('fetchRecords');
              const categories = await this.$store.dispatch('fetchCategories');

              this.Locale = this.info.locale;

              this.categories  = categories.map( c => {
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

                  let tooltip = ''

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
            ...mapGetters(['info']), // get Users Info from Firebase
        },

    }
</script>

<style scoped>

</style>
