<template>

    <table>
        <thead>
        <tr>
            <th>#</th>
            <th>Сумма</th>
            <th>Дата</th>
            <th>Категория</th>
            <th>Тип</th>
            <th>Открыть</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(r,i) in records" :key="r.id">
            <td>{{i+1}}</td>
            <td>{{r.amount | currency}}</td>
            <td>{{r.date | date('datetime') }}</td>
            <td>{{r.categoryName}}</td>
            <td>
                <span class="white-text badge " :class="[r.typeClass]">{{r.typeText}}</span>
            </td>
            <td>
                <button
                        v-tooltip="'Просмотр записи'"
                        class="btn-small btn"
                        @click="$router.push('/detail-record/' + r.id)"
                >
                    <i class="material-icons">open_in_new</i>
                </button>
            </td>
        </tr>
        </tbody>
    </table>

</template>

<script>
    export default {
        name: "history-table",
        props: {
            records: {
                required: true,
                type: Array
            }
        }

    }
</script>

<style scoped>

</style>
