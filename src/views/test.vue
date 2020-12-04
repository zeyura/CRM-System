<template> </template>

<script>
import {mapGetters, mapActions} from '@'
export default {
    name: 'componentname',
    components: {},
    data: () => ({
        arr = []
    }),
    mounted() {

    },
    methods: {
        ...mapActions(['fn']),
    },
    computed: {
        ...mapGetters(['info'])
    }
}
</script>

<style lang="scss" scoped>
.class {
}
</style>
