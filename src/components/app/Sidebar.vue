<template>

    <ul class="sidenav app-sidenav " :class="{'open': isOpen}">
        <router-link
            v-for="link in links"
            :key="link.url"
            tag="li"
            active-class="active"
            :to="link.url"
            :exact="link.exact"
        >
            <a href="#" class="waves-effect waves-orange pointer">{{link.title}}</a>
        </router-link>
    </ul>

</template>

<script>
    import localizeFilter from "@/filters/localize.filter"
    export default {
        name: "sidebar",
        props: ['isOpen'],
        data: () => ({
            links: [
                {title: localizeFilter('menu_Bill'), url: '/', exact: true },
                {title: localizeFilter('menu_History'), url: '/history' },
                {title: localizeFilter('menu_Planning'), url: '/planning' },
                {title: localizeFilter('menu_NewRecord'), url: '/record' },
                {title: localizeFilter('menu_Categories'), url: '/categories' }
            ]
        }),
    }
</script>

<style lang="scss" scoped>

</style>
