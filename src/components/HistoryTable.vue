<template>

    <table>
        <thead>
        <tr>
            <th>#</th>
            <th>{{'sum' | localize}}</th>
            <th>{{'date' | localize}}</th>
            <th>{{'category' | localize}}</th>
            <th>{{'type' | localize}}</th>
            <th>{{'open' | localize}}</th>
            <th>{{'remove' | localize}}</th>
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
                        v-tooltip="tooltip"
                        class="btn-small btn"
                        @click="$router.push('/detail-record/' + r.id)"
                >
                    <i class="material-icons">open_in_new</i>
                </button>
            </td>
            <td>
                <button
                        v-tooltip="tooltipDel"
                        class="btn-small btn red"
                        @click="$emit('removeRecord', r.id)"
                >
                    <i class="material-icons">close</i>
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
        },
        data: () => ({
            tooltip: '',
            tooltipDel: '',
        }),
        created() {
            if( this.$store.getters.info.locale === 'ru-RU' ) {
                this.tooltip = 'Просмотр записи';
                this.tooltipDel = 'Удалить запись';
            }
            if( this.$store.getters.info.locale === 'en-US' ) {
                this.tooltip = 'Viewing a recording';
                this.tooltipDel = 'Remove record';
            }
        }

    }
</script>

<style scoped>

</style>
