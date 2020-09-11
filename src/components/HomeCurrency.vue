<template>
    <div class="col s12 m6 l8">
        <div class="card orange darken-1 bill-card">
            <div class="card-content white-text">
                <div class="card-header">
                    <span class="card-title" style="margin-bottom: 26px">Курс валют</span>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>Валюта</th>
                        <th>Курс</th>
                        <th>Дата</th>
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
