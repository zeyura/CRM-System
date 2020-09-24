<template>
    <div class="col s12 l8">
        <div class="card amber lighten-3 bill-card">
            <div class="card-content ">
                <div class="card-header">
                    <span class="card-title" style="margin-bottom: 26px">{{'exchangeRates' | localize}}</span>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>{{'valute' | localize}}</th>
                        <th>{{'rate' | localize}}</th>
                        <th>{{'date' | localize}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="cur in currencies" :key="cur" >
                        <td>{{cur}}</td>
                        <td>{{cur == 'EUR' ? 1 : rates[cur].toFixed(2)}}</td>
                        <td>{{date | date('date')}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "home-currency",
        props: ['rates', 'date'],
        data: () => ({
            currencies: null, // будет массив с названиями валют

        }),

        created() {
            this.currencies = Object.keys(this.rates);
        }
    }
</script>

<style scoped>

</style>
