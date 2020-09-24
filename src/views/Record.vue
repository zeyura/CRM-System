<template>

    <div>
        <div class="page-title">
            <h3>{{'recordTitle' | localize}}</h3>
        </div>

        <loader v-if="loading" />
        <p class="center" v-else-if="!categories.length">Категорий пока нет. <router-link to="/categories">Добавить категорию</router-link> </p>
        <form v-else class="form" @submit.prevent="submitHandler">
            <div class="input-field" >
                <select ref="select" v-model="category">
                    <option
                            v-for="cat in categories"
                            :key="cat.id"
                            :value="cat.id"
                    >
                        {{cat.title}}
                    </option>
                </select>
                <label>{{'selectCategory' | localize}}</label>
            </div>

            <p>
                <label>
                    <input
                            class="with-gap"
                            name="type"
                            type="radio"
                            value="income"
                            v-model="radioType"
                    />
                    <span>{{'income' | localize}}</span>
                </label>
            </p>

            <p>
                <label>
                    <input
                            class="with-gap"
                            name="type"
                            type="radio"
                            value="outcome"
                            v-model="radioType"
                    />
                    <span>{{'outcome' | localize}}</span>
                </label>
            </p>

            <div class="input-field">
                <input
                        id="amount"
                        type="number"
                        v-model.number="amount"
                        :class="{invalid: ($v.amount.$dirty && !$v.amount.minValue) || ($v.amount.$dirty && !$v.amount.required) }"
                >
                <label for="amount">{{'sum' | localize}}</label>
                <span class="helper-text invalid"
                      v-if="$v.amount.$dirty && !$v.amount.minValue"
                >
                    {{'message_minSum' | localize}} {{$v.amount.$params.minValue.min}} RUB
                </span>
                <span class="helper-text invalid"
                      v-if="$v.amount.$dirty && !$v.amount.required"
                >
                    {{'message_EmptyField' | localize}}
                </span>
            </div>

            <div class="input-field">
                <input
                        id="description"
                        type="text"
                        v-model="description"
                        :class="{invalid: $v.description.$dirty && !$v.description.required}"
                >
                <label for="description">{{'description' | localize}}</label>
                <span class="helper-text invalid"
                      v-if="$v.description.$dirty && !$v.description.required"
                >
                    {{'message_enterDescription' | localize}}
                </span>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
                {{'btn_create' | localize}}
            </button>
        </form>
    </div>

</template>

<script>
    import {required, minValue} from 'vuelidate/lib/validators'
    import {mapGetters} from 'vuex'
    export default {
        name: "record",
        data: () => ({
            categories: [],
            loading: true,
            category: null,
            radioType: 'income',
            amount: 1,
            description: '',
            Locale: ''
        }),
        validations: { // после установки vuelidate /  npm install vuelidate --save
            description: {required},
            amount: {required, minValue: minValue(1)} // min 1 RUB
        },
        async mounted() {
            this.Locale = this.info.locale;

            this.categories = await this.$store.dispatch('fetchCategories');
           //console.log( this.categories )

            this.loading = false;
            setTimeout(() => {
                this.select = M.FormSelect.init(this.$refs.select);
                M.updateTextFields();
            }, 0);

            if( this.categories.length ) {
                this.category = this.categories[0].id;
            }

        },
        computed: {
            ...mapGetters(['info']),
            canCreateRecord() {
                if( this.radioType === 'income' ) {
                    return true;
                }
                return this.info.bill >= this.amount;
            }
        },
        methods: {
            async submitHandler() {
                if(this.$v.$invalid) { // if Form is in Invalid
                    this.$v.$touch();
                    return
                }

                if( this.canCreateRecord ) {
                    try {
                        const res = await this.$store.dispatch('createRecord', {
                            categoryID: this.category,
                            amount: this.amount,
                            description: this.description,
                            type: this.radioType,
                            date: new Date().toJSON() // для файрбейз надо сделать .toJSON()
                        });

                        const bill = this.radioType === 'income'
                            ? this.info.bill + this.amount
                            : this.info.bill - this.amount;

                        await this.$store.dispatch('updateInfo', {bill});

                        if( this.Locale === 'ru-RU' ) {
                            this.$message(`Запись добавлена. Счет: ${bill} RUB`);
                        } else if( this.Locale === 'en-US' ) {
                            this.$message(`The entry has been added. Score: ${bill} RUB`);
                        }

                        this.$v.$reset(); // обнулить форму
                        this.amount = 1;
                        this.description = '';

                    } catch (e) {
                        this.$error(e);
                    }
                } else {
                    if( this.Locale === 'ru-RU' ) {
                        this.$message(`Нехватка средств на счете (${this.amount - this.info.bill} RUB)`)
                    } else if( this.Locale === 'en-US' ) {
                        this.$message(`Lack of funds in the account (${this.amount - this.info.bill} RUB)`)
                    }
                }

            }
        },

        destroyed() {
            if( this.select && this.select.destroy) {
                this.select.destroy();
            }
        }

    }
</script>

<style scoped>

</style>
