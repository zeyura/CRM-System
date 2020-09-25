<template>

    <div>
        <div class="page-title">
            <h3>{{'profileTitle' | localize}}</h3>
        </div>

        <div class="switch">
            <label>
                English
                <input type="checkbox" v-model="isLocsleRU">
                <span class="lever"></span>
                Русский
            </label>
        </div>

        <form class="form" @submit.prevent="submitHandler">
            <div class="input-field">
                <input
                        v-model="name"
                        id="name"
                        type="text"
                        :class="{invalid: ($v.name.$dirty && !$v.name.required) }"
                >
                <label for="name">{{'name' | localize}}</label>
                <small class="helper-text invalid"
                       v-if="$v.name.$dirty && !$v.name.required"
                >{{'message_EnterName' | localize}}</small>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
                {{'btn_update' | localize}}
            </button>
        </form>
    </div>

</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import {required} from 'vuelidate/lib/validators'
    export default {
        name: "profile",
        metaInfo() { // vue-meta plugin
            return {
                title: this.$title('profileTitle'),
                htmlAttrs: {
                    lang: this.$lang('lang')
                }
            }
        },
        data: () => ({
            name: '',
            isLocsleRU: true,

        }),
        validations: {
            name: {required}
        },
        mounted() {
            this.name = this.info.name;
            setTimeout(() => {
                M.updateTextFields()
            },0);

            this.isLocsleRU = this.info.locale === 'ru-RU';
        },
        computed: {
            ...mapGetters(['info']),

        },
        methods: {
            ...mapActions(['updateInfo']),
            async submitHandler() {

                if(this.$v.$invalid) {
                    this.$v.$touch();
                    return
                }

                try {
                    await this.updateInfo({
                        name: this.name,
                        locale: this.isLocsleRU ? 'ru-RU' : 'en-US'
                    });
                } catch (e) {}

            },

        }

    }
</script>

<style scoped>

    .switch {
        margin: 0 0 30px;
    }

</style>
