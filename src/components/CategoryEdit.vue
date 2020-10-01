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
                        @change="isSomeChanges"
                        @input="isSomeChanges"
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
                        @change="isSomeChanges"
                        @input="isSomeChanges"
                >
                <label for="categ-create-limit">{{'limit' | localize}}</label>
                <span class="helper-text invalid"
                      v-if="$v.limit.$dirty && !$v.limit.minValue"
                >
                    {{'message_minSum' | localize}} {{$v.limit.$params.minValue.min}} RUB
                </span>
            </div>

            <button class="waves-effect waves-light btn red" v-if="!canDelete" type="button"
                    @click="canDelete = true"
                    style="margin-right: 20px; margin-bottom: 20px">
                {{'remove' | localize}}
            </button>
            <button class="waves-effect waves-light btn red" v-else  type="button"
                    @click='delCategory'
                    style="margin-right: 20px; margin-bottom: 20px">
                {{'imSure' | localize}}
            </button>

            <button class="btn waves-effect waves-light" :class="{'disabled': submitDisabled}" type="submit" style="margin-right: 20px; margin-bottom: 20px" >
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
            submitDisabled: true,
            canDelete: false,
            current: null,
            select: null,
            title: '',
            startTitle:'',
            limit: 100,
            startLimit: '',
            Locale: ''
        }),
        validations: { // после установки vuelidate /  npm install vuelidate --save
            title: {required},
            limit: {minValue: minValue(100)} // min 1 RUB
        },
        watch: {
            current(catID) {
                const {title, limit} = this.categories.find( c => c.id === catID);
                this.title = this.startTitle = title;
                this.limit = this.startLimit = limit;
                this.canDelete = false
            }
        },
        created() {
            this.startSettings();
        },
        mounted() {
            this.Locale = this.$store.getters.info.locale;
            this.select = M.FormSelect.init(this.$refs.select, {});
            M.updateTextFields();
        },
        methods: {
            startSettings() {
                const {id, title, limit} = this.categories[0];
                this.current = id;
                this.title   = this.startTitle = title;
                this.limit   = this.startLimit = limit;
            },
            isSomeChanges() {
                if(this.title === this.startTitle && this.limit === this.startLimit ) this.submitDisabled = true;
                else this.submitDisabled = false;
            },
            async delCategory() {
                try{
                    const res = await this.$store.dispatch('deleteCategory', this.current);

                    if( this.Locale === 'ru-RU' ) {
                        this.$message('Категория удалена');
                    } else if( this.Locale === 'en-US' ) {
                        this.$message('Category removed');
                    }

                    this.$emit('deleted', this.current);

                } catch(e) {}
            },
            async submitHandler() {

                if(this.$v.$invalid) { // if Form is in Invalid
                    this.$v.$touch();
                    return
                }
                if(this.title === this.startTitle && this.limit === this.startLimit ) return;

                this.submitDisabled = false;

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
