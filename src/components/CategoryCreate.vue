<template>
    <div style="margin-bottom: 3rem;">
        <div class="page-subtitle">
            <h4>{{'categoryCreate' | localize}}</h4>
        </div>

        <form @submit.prevent="submitHandler">
            <div class="input-field">
                <input
                        id="categ-create-name"
                        type="text"
                        v-model="title"
                        :class="{invalid: $v.title.$dirty && !$v.title.required }"
                >
                <label for="categ-create-name">{{'categoryName' | localize}}</label>
                <span class="helper-text invalid"
                    v-if="$v.title.$dirty && !$v.title.required"
                >
                    {{'message_enterCategoryName' | localize}}
                </span>
            </div>

            <div class="input-field">
                <input
                        id="categ-create-limit"
                        type="number"
                        v-model.number="limit"
                        :class="{invalid: $v.limit.$dirty && !$v.limit.minValue}"
                >
                <label for="categ-create-limit">{{'limit' | localize}}</label>
                <span class="helper-text invalid"
                    v-if="$v.limit.$dirty && !$v.limit.minValue"
                >
                    {{'message_minSum' | localize}} {{$v.limit.$params.minValue.min}} RUB
                </span>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
                {{'btn_create' | localize}}
                <i class="material-icons right">send</i>
            </button>
        </form>
    </div>
</template>

<script>
    import {required, minValue} from 'vuelidate/lib/validators'

    export default {
        name: "category-create",
        data: () => ({
            title: '',
            limit: 100,
            Locale: ''
        }),

        validations: { // после установки vuelidate /  npm install vuelidate --save
            title: {required},
            limit: {minValue: minValue(100)} // min 1 RUB
        },
        mounted() {
            this.Locale = this.$store.getters.info.locale;
            M.updateTextFields();  // апдейтим чтоб не накладівались плейсхолдеры и титлы в инпутах )
        },
        methods: {
            async submitHandler() {

                if(this.$v.$invalid) { // if Form is in Invalid
                    this.$v.$touch();
                    return
                }

                try {
                    const category = await this.$store.dispatch('createCategory', {
                        title: this.title,
                        limit: this.limit
                    });
                    this.title = '';
                    this.limit = 100;
                    this.$v.$reset(); // сбросили состояние формы   для валидатора
                    if( this.Locale === 'ru-RU' ) {
                        this.$message('Категория была создана');
                    } else if( this.Locale === 'en-US' ) {
                        this.$message('Category was created');
                    }
                    this.$emit('created', category);

                   // this.$router.push('/')
                } catch (e) {}

            }
        }
    }
</script>

<style scoped>

</style>
