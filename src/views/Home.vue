<template>

    <div class="home">
        <div class="page-title">
            <h3>{{'homeTitle' | localize}}</h3>

            <button class="btn refresh-btn waves-effect waves-light btn-small" :class="{active:refreshing}" @click="refresh">
                <i class="material-icons">refresh</i>
            </button>
        </div>

        <loader v-if="loading" />
        <div v-else class="row">

            <home-bill
                :rates="currency.rates"
            />

            <home-currency
                :rates= "currency.rates"
                :date = "currency.date"
            />

        </div>
    </div>

</template>

<script>
    // @ is an alias to /src
    import HomeBill from '@/components/HomeBill'
    import HomeCurrency from '@/components/HomeCurrency'

    export default {
        name: 'Home',
        metaInfo() { // vue-meta plugin
            return {
                title: this.$title('homeTitle'),
                htmlAttrs: {
                    lang: this.$lang('lang')
                }
            }
        },
        components: {
            HomeBill, HomeCurrency
        },
        data: () => ({
            loading: true,
            refreshing: false,
            currency: null
        }),
        async mounted() {
             // this.currency = await this.$store.dispatch('fetchCurrency');

            // замокали пока,  чтоб не платить провайдеру по  валютам ))
            this.currency = {
                "success":true,
                "base":"EUR",
                "date": new Date(),
                "rates":{
                    "RUB":91.19,
                    "USD":1.18,
                    "EUR":1,
                    "UAH":33.1
                }
            };

              setTimeout(() => {
                  this.loading  = false;
              }, 400);
        },
        methods: {
            async refresh() {
                this.loading  = true;
                this.refreshing = true;

               //this.currency = await this.$store.dispatch('fetchCurrency');
                setTimeout(() => {
                    this.loading  = false;
                    this.refreshing = false;
                }, 200);
            }
        }

    }
</script>

<style scoped lang="scss">
    .refresh-btn {
        &.active {
            i[class*=icon] {
                animation: ref-rotate .8s infinite linear;
            }

        }
    }
    
    @keyframes ref-rotate {
        from {
            transform: rotate(0);
        }
        to  {
            transform: rotate(360deg);
        }
    }
</style>
