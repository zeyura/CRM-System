<template>

    <form class="card auth-card" @submit.prevent="submitHandler">
        <div class="card-content">
            <span class="card-title">Домашняя бухгалтерия</span>
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
                >Поле не должно быть пустым</small>
                <small class="helper-text invalid"
                       v-else-if="$v.email.$dirty && !$v.email.email"
                >Введите корректный Email</small>
            </div>
            <div class="input-field">
                <input
                        id="password"
                        type="password"
                        v-model.trim="password"
                        :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength) }"
                >
                <label for="password">Пароль</label>
                <small class="helper-text invalid"
                       v-if="$v.password.$dirty && !$v.password.required"
                >Поле не должно быть пустым</small>
                <small class="helper-text invalid"
                       v-if="$v.password.$dirty && !$v.password.minLength"
                >Пароль должен содержать мин {{$v.password.$params.minLength.min}} символов. Сейчас {{password.length}}</small>
            </div>
        </div>
        <div class="card-action">
            <div>
                <button
                        class="btn waves-effect waves-light auth-submit"
                        type="submit"
                >
                    Войти
                    <i class="material-icons right">send</i>
                </button>
            </div>

            <p class="center">
                Нет аккаунта?
                <router-link to="/register">Зарегистрироваться</router-link>
            </p>
        </div>
    </form>

</template>

<script>
    import {email, required, minLength} from 'vuelidate/lib/validators'
    export default {
        name: "login",
        data: () => ({
            email: '',
            password: ''
        }),
        validations: { // после установки vuelidate /  npm install vuelidate --save
            email: {email, required},
            password: {required, minLength: minLength(6)} // min 6 symbols
        },
        methods: {
            submitHandler() {

                if(this.$v.$invalid) { // if Form is in Invalid
                    this.$v.$touch();
                    return
                }

                const formData = {
                    email: this.email,
                    password: this.password
                }

                //console.info(formData)

                this.$router.push('/')
            }
        }

    }
</script>

<style lang="scss" scoped>

    .card .card-content .card-title {
        margin-bottom: 25px;
    }

</style>
