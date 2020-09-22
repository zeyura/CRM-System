<template>

    <div class="app-main-layout">

        <Navbar
            @sidebarToggle="isSidebarOpen = !isSidebarOpen"
        />

        <Sidebar
            :isOpen="isSidebarOpen"
            :key="locale"
        />

        <main class="app-content"  :class="{'full': !isSidebarOpen}">
            <div class="app-page">

                <router-view />

            </div>
        </main>

        <div class="fixed-action-btn ">
            <router-link class="btn-floating btn-large blue  waves-effect waves-circle waves-light_" to="/record"
                    v-tooltip="'Создать новую запись'"
            >
                <i class="large material-icons">add</i>
            </router-link>
        </div>
    </div>

</template>

<script>
    import Navbar from '@/components/app/Navbar'
    import Sidebar from '@/components/app/Sidebar'
    import messages from '@/utilites/messages'
    export default {
        name: "main-layout",
        components: {
            Navbar, Sidebar
        },
        data: () => ({
            isSidebarOpen: true
        }),
        async mounted() {
            if( !Object.keys(this.$store.getters.info).length ) { //  if  store.info empty   -->  {}
                await this.$store.dispatch('fetchInfo');
            }
        },
        computed: {
            error() {
                return this.$store.getters.error;
            },
            locale() {
                // комп свойство locale для сайдбара
                // если меняется язык тое  локаль то  сайдбар будет сразу перерендериваться
                // благодаря хаку  :key="locale"
                return this.$store.getters.info.locale;
            }
        },
        watch: {
            error(fbError) { // наблюдаем за error из computed
                this.$error(messages[fbError.code] || 'Что-то пошло не так')
            }
        },
        methods: {

        }

    }
</script>

<style scoped>

</style>
