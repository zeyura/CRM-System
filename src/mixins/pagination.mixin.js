// https://www.npmjs.com/package/vuejs-paginate
//  npm install vuejs-paginate --save
// - - -
//    не забыть поставить LoDash
// --    npm i --save lodash
import _ from 'lodash'

export default {
    data: () => ({
        page: 1,// current page
        pageSize: 3, // items per page
        pageCount: 0,//
        allItems: [],// тут будут подмассивы по pageSize элементов )
        items: [],   // items for Display
        showAllinPage: false
    }),
    methods: {
        setupPagination(allItems) {
            // _.chunk(arr,n) - разбивает массив arr на подмассивы в которых по n элементов
            //  в последнем может быть меньше ---
            //  _.chunk([1,2,3,4], 2) -->  [ [1,2], [3,4] ]
            this.allItems = _.chunk(allItems, this.pageSize);
            this.pageCount = _.size(this.allItems);  // this.allItems.length;
            this.items = this.allItems[this.page - 1] || this.allItems[0];

            if( this.$route.query.show === 'all' ) {
                this.showAllItems()
            }
        },

        pageChangeHandler(page) { // page - приходит номер страницы
            //this.page = page;
            this.$router.push(`${this.$route.path}?page=${page}`);
            this.items = this.allItems[page - 1] || this.allItems[0];
        },

        showAllItems() {
            if( !this.$route.query.show ) {
                this.$router.push(`${this.$route.path}?show=all`);
            }
            let arr = [];
            this.allItems.forEach((v,i) => {
                v.forEach(item => arr.push(item));
            });

            this.pageCount = 1;
            this.items = arr;
            this.showAllinPage = true;
            arr = []
        }
    },
    created() {
        // при начальной загрузке забираем квери парам из адрес строки
        this.page = +this.$route.query.page || 1;

    }
}
