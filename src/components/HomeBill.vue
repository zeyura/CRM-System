<template>
    <div class="col s12 l4">
        <div class="card bill-card">
            <div class="card-content white-text">
                <span class="card-title">{{'billValute' | localize}}</span>

                <p class="currency-line" v-for="(cur,i) in currencies" :key="cur">
                    <span>{{ getCurrency(cur) | currency(cur) }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "home-bill",
        props: ['rates'],
        data: () => ({
            currencies: null, // будет массив с названиями валют

        }),
        computed: {
            base() {
                // у нас базовая валюта Евро   rates['EUR'] = 1
                // счет в базе в руб
                // получим кол-во денег на счету в Евро ( базовый счет ) =>
                return this.$store.getters.info.bill / ( this.rates['RUB'] / this.rates['EUR'] );
            }
        },
        methods: {
            getCurrency(cur) {
                return (this.rates[cur] * this.base).toFixed(2);
            }
        },
        created() {
            this.currencies = Object.keys(this.rates);
        }

    }
</script>

<style scoped>

</style>
