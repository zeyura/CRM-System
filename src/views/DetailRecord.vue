<template>

    <div>
        <div class="breadcrumb-wrap">
            <router-link to="/history" class="breadcrumb">История</router-link>
            <a class="breadcrumb">
                {{breadcrumbType}}
            </a>
        </div>

        <div class="row">
            <loader v-if="loading" />

            <div v-else-if="record" class="col s12 m6">
                <div
                        class="card "
                        :class="{
                            red: record.type === 'outcome',
                            green: record.type === 'income'
                        }"
                >
                    <div class="card-content white-text">
                        <p>ОПИСАНИЕ: {{record.description}}</p>
                        <p>СУММА: {{record.amount | currency}}</p>
                        <p>КАТЕГОРИЯ: {{record.category}}</p>

                        <br>
                        <small>{{record.date | date('datetime')}}</small>
                    </div>
                </div>
            </div>

            <p v-else class="center">Запись с id: {{record.categoryID}} не найдена</p>
        </div>
    </div>

</template>

<script>
    export default {
        name: "detail-record",
        data: () => ({
            loading: true,
            record: null,
            breadcrumbType: ''
        }),
        async mounted() {
            const recordID = this.$route.params.id;
            const record   = await this.$store.dispatch('fetchRecordByID', recordID);
            const category = await this.$store.dispatch('fetchCategoryByID', record.categoryID);

            this.record = {
                ...record,
                category: category.title
            };
            this.breadcrumbType = record.type === 'income' ? 'Доход' : 'Расход';

            this.loading = false;
        }
    }
</script>

<style scoped>

</style>
