<template>

    <form class="card auth-card" @submit.prevent="submitHandler">
        <div class="card-content">
            <span class="card-title">{{'registerTitle' | localize}}</span>

            <div class="input-field">
                <input
                        id="name"
                        type="text"
                        v-model.trim="name"
                        :class="{invalid: ($v.name.$dirty && !$v.name.required) }"
                >
                <label for="name">{{'name' | localize}}</label>
                <small class="helper-text invalid"
                       v-if="$v.name.$dirty && !$v.name.required"
                >{{'message_EnterYourName' | localize}}</small>
            </div>
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

            <p>
                <label>
                    <input type="checkbox" v-model="agree" />
                    <span>{{'ImAgree' | localize}}</span>
                </label>
            </p>
        </div>
        <div class="card-action">
            <div>
                <button
                        class="btn waves-effect waves-light auth-submit"
                        type="submit"
                >
                    {{'btn_signUp' | localize}}
                </button>
            </div>

            <p class="center">
                {{'haveAccount' | localize}}
                <router-link to="/login">{{'btn_enter' | localize}}</router-link>
            </p>
        </div>
    </form>

</template>

<script>
    import {email, required, minLength} from 'vuelidate/lib/validators'
    export default {
        name: "register",
        metaInfo() { // vue-meta plugin
            return {
                title: this.$title('registerTitle'),
                htmlAttrs: {
                    lang: this.$lang('lang')
                }
            }
        },
        data: () => ({
            email: '',
            password: '',
            name:  '',
            agree: false
        }),
        validations: { // после установки vuelidate /  npm install vuelidate --save
            email: {email, required},
            password: {required, minLength: minLength(6)}, // min 6 symbols
            name: {required},
            // для agree пишем свой валидатор checked - он должен возвращать труе   checked: v => v
            agree: {checked: v => v}  //  return true ^)
        },
        methods: {
            async submitHandler() {

                if(this.$v.$invalid) { // if Form is in Invalid
                    this.$v.$touch();
                    return
                }

                const formData = {
                    email: this.email,
                    password: this.password,
                    name: this.name,
                   // agree: this.agree
                };

                try {
                    await this.$store.dispatch('register', formData);
                    this.$router.push('/');
                } catch (e){}

            }
        }

    }
</script>

<style scoped>

</style>
