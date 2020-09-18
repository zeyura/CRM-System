<template>
    <div class="grey darken-1 empty-layout">
        <router-view/>
    </div>
</template>

<script>
    import messages from '@/utilites/messages'
    export default {
        name: "empty-layout",
        computed: {
            error() {
                return this.$store.getters.error;
            }
        },
        watch: {
            error(fbError) { // наблюдаем за error из computed
                this.$error(messages[fbError.code] || 'Что-то пошло не так')
            }
        }
    }
</script>

<style scoped>

</style>
