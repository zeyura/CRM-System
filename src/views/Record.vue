<template>

    <div>
        <div class="page-title">
            <h3>Новая запись</h3>
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
                <label>Выберите категорию</label>
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
                    <span>Доход</span>
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
                    <span>Расход</span>
                </label>
            </p>

            <div class="input-field">
                <input
                        id="amount"
                        type="number"
                        v-model.number="amount"
                        :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"
                >
                <label for="amount">Сумма</label>
                <span class="helper-text invalid"
                      v-if="$v.amount.$dirty && !$v.amount.minValue"
                >
                    Минимальная сумма {{$v.amount.$params.minValue.min}} RUB
                </span>
            </div>

            <div class="input-field">
                <input
                        id="description"
                        type="text"
                        v-model="description"
                        :class="{invalid: $v.description.$dirty && !$v.description.required}"
                >
                <label for="description">Описание</label>
                <span class="helper-text invalid"
                      v-if="$v.description.$dirty && !$v.description.required"
                >
                    Введите описание
                </span>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
                Создать
                <i class="material-icons right">send</i>
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
            description: ''
        }),
        validations: { // после установки vuelidate /  npm install vuelidate --save
            description: {required},
            amount: {minValue: minValue(1)} // min 1 RUB
        },
        async mounted() {
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

                        this.$message(`Запись добавлена. Счет: ${bill} RUB`);

                        this.$v.$reset(); // обнулить форму
                        this.amount = 1;
                        this.description = '';

                    } catch (e) {
                        this.$error(e);
                    }
                } else {
                    this.$message(`Нехватка средств на счете (${this.amount - this.info.bill} RUB)`)
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
