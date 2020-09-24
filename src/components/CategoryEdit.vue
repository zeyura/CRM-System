<template>
    <div style="margin-bottom: 3rem;">
        <div class="page-subtitle">
            <h4>{{'editTitle' | localize}}</h4>
        </div>

        <form @submit.prevent="submitHandler">
            <div class="input-field" >
                <select ref="select" v-model="current">
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

            <div class="input-field" style="margin-top: 1.5rem">
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

            <div class="input-field" style="margin-top: 1.5rem">
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
                {{'btn_update' | localize}}
            </button>
        </form>

    </div>
</template>

<script>
    import {required, minValue} from 'vuelidate/lib/validators'
    export default {
        name: "category-edit",
        props: ['categories'],
        data: () => ({
            current: null,
            select: null,
            title: '',
            limit: 100,
            Locale: ''
        }),
        validations: { // после установки vuelidate /  npm install vuelidate --save
            title: {required},
            limit: {minValue: minValue(100)} // min 1 RUB
        },
        watch: {
            current(catID) {
                const {title, limit} = this.categories.find( c => c.id === catID);
                this.title = title;
                this.limit = limit;
            }
        },
        created() {
            const {id, title, limit} = this.categories[0];
            this.current = id;
            this.title   = title;
            this.limit   = limit;
        },
        mounted() {
            this.Locale = this.$store.getters.info.locale;
            this.select = M.FormSelect.init(this.$refs.select, {});
            M.updateTextFields();
        },
        methods: {
            async submitHandler() {

                if(this.$v.$invalid) { // if Form is in Invalid
                    this.$v.$touch();
                    return
                }

                try {
                    const categoryData = {
                        title: this.title,
                        limit: this.limit,
                        id:    this.current
                    };

                    await this.$store.dispatch('updateCategory', categoryData);
                    if( this.Locale === 'ru-RU' ) {
                        this.$message('Категория успешно обновлена');
                    } else if( this.Locale === 'en-US' ) {
                        this.$message('Category updated successfully');
                    }

                    this.$emit('updated', categoryData)

                } catch (e) {}
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
