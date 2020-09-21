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
                :records="records"
            />

        </section>
    </div>

</template>

<script>
    import HistoryTable from '@/components/HistoryTable'
    export default {
        name: "history",
        components: { HistoryTable },
        data: () => ({
            loading: true,
            records: [],
            categories: [],

        }),
        async mounted() {

            // this.records = await this.$store.dispatch('fetchRecords');
            const records   = await this.$store.dispatch('fetchRecords');
            this.categories = await this.$store.dispatch('fetchCategories');

            this.records = records.map(record => {
                return {
                    ...record,
                    categoryName: this.categories.find(c => c.id === record.categoryID).title,
                    typeClass: record.type === 'income' ? 'green' : 'red',
                    typeText:  record.type === 'income' ? 'Доход' : 'Расход',

                }
            });

            this.loading = false;
        },

    }
</script>

<style scoped>

</style>
