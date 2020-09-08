<template>

    <div class="app-main-layout">

        <Navbar
            @sidebarToggle="isSidebarOpen = !isSidebarOpen"
        />

        <Sidebar
            :isOpen="isSidebarOpen"
        />

        <main class="app-content"  :class="{'full': !isSidebarOpen}">
            <div class="app-page">

                <router-view />

            </div>
        </main>

        <div class="fixed-action-btn ">
            <router-link class="btn-floating btn-large blue  waves-effect waves-circle waves-light_" to="/record">
                <i class="large material-icons">add</i>
            </router-link>
        </div>
    </div>

</template>

<script>
    import Navbar from '@/components/app/Navbar'
    import Sidebar from '@/components/app/Sidebar'
    export default {
        name: "main-layout",
        components: {
            Navbar, Sidebar
        },
        data: () => ({
            isSidebarOpen: true
        }),

    }
</script>

<style scoped>

</style>
