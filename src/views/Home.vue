<template>

    <div class="home">
        <div class="page-title">
            <h3>Счет</h3>

            <button class="btn waves-effect waves-light btn-small">
                <i class="material-icons">refresh</i>
            </button>
        </div>

        <loader v-if="loading" />
        <div v-else class="row">

            <home-bill />

            <home-currency />

        </div>
    </div>

</template>

<script>
    // @ is an alias to /src
    import HomeBill from '@/components/HomeBill'
    import HomeCurrency from '@/components/HomeCurrency'

    export default {
        name: 'Home',
        data: () => ({
            loading: true,
            currency: null
        }),
        components: {
            HomeBill, HomeCurrency
        }
    }
</script>
