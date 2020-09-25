<template>

    <form class="card auth-card" @submit.prevent="submitHandler">
        <div class="card-content">
            <span class="card-title">{{'loginTitle' | localize}}</span>
            <div class="input-field">
                <input
                        id="email"
                        type="text"
                        v-model.trim="email"
                        :class="{invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email) }"
                >
                <label for="email">Email</label>
                <small class="helper-text invalid"
                        v-if="$v.email.$dirty && !$v.email.required"
                >{{'message_EmptyField' | localize}}</small>
                <small class="helper-text invalid"
                       v-else-if="$v.email.$dirty && !$v.email.email"
                >{{'message_Email' | localize}}</small>
            </div>
            <div class="input-field">
                <input
                        id="password"
                        type="password"
                        v-model.trim="password"
                        :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength) }"
                >
                <label for="password">{{'password' | localize}}</label>
                <small class="helper-text invalid"
                       v-if="$v.password.$dirty && !$v.password.required"
                >{{'message_EmptyField' | localize}}</small>
                <small class="helper-text invalid"
                       v-if="$v.password.$dirty && !$v.password.minLength"
                >{{'message_password1' | localize}} {{$v.password.$params.minLength.min}} {{'message_password2' | localize}} {{password.length}}</small>
            </div>
        </div>
        <div class="card-action">
            <div>
                <button
                        class="btn waves-effect waves-light auth-submit"
                        type="submit"
                >
                    {{'btn_enter' | localize}}
                </button>
            </div>

            <p class="center">
                {{'noAccount' | localize}}
                <router-link to="/register">{{'register' | localize}}</router-link>
            </p>
        </div>
    </form>

</template>

<script>
    import {email, required, minLength} from 'vuelidate/lib/validators'
    import messages from '@/utilites/messages'

    export default {
        name: "login",
        metaInfo() { // vue-meta plugin
            return {
                title: this.$title('loginTitle'),
                htmlAttrs: {
                    lang: this.$lang('lang')
                }
            }
        },
        data: () => ({
            email: '',
            password: ''
        }),
        validations: { // после установки vuelidate /  npm install vuelidate --save
            email: {email, required},
            password: {required, minLength: minLength(6)} // min 6 symbols
        },
        mounted() {
            if( messages[this.$route.query.state] ) { // if is query param   ?state=logout
                setTimeout(() => {
                    this.$message(messages[this.$route.query.state]);
                }, 300)
            }

        },
        methods: {
            async submitHandler() {

                if(this.$v.$invalid) { // if Form is in Invalid
                    this.$v.$touch();
                    return
                }

                const formData = {
                    email: this.email,
                    password: this.password
                }

                try {
                    await this.$store.dispatch('login', formData);
                    this.$router.push('/')
                } catch (e) {}

            },

        }

    }
</script>

<style lang="scss" scoped>

    .card .card-content .card-title {
        margin-bottom: 25px;
    }

</style>
