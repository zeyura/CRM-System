<template>

    <table class="highlight striped" :class="{'sort-ask': sortAsk, 'sort-desk': !sortAsk, 'transed': transit}">
        <thead>
        <tr>
            <th>#</th>
            <th class="hoverEnb" @click="sorter(0)">{{'sum' | localize}} <span :class="{active: sortNumer===0}"></span></th>
            <th class="hoverEnb" @click="sorter(1)">{{'date' | localize}} <span :class="{active: sortNumer===1}"></span></th>
            <th class="hoverEnb" @click="sorter(2)">{{'category' | localize}} <span :class="{active: sortNumer===2}"></span></th>
            <th class="hoverEnb" @click="sorter(3)">{{'type' | localize}} <span :class="{active: sortNumer===3}"></span></th>
            <th>{{'open' | localize}}</th>
            <th>{{'remove' | localize}}</th>
        </tr>
        </thead>
        <transition-group name="flip-list" tag="tbody">
        <tr v-for="(r,i) in records" :key="r.id">
            <td>{{i+1}}</td>
            <td>{{r.amount | currency}}</td>
            <td>{{r.date | date('datetime') }}</td>
            <td>{{r.categoryName}}</td>
            <td>
                <span class="white-text badge " :class="[r.typeClass]">{{r.typeText}}</span>
            </td>
            <td>
                <button
                        v-tooltip="tooltip"
                        class="btn-small btn"
                        @click="$router.push('/detail-record/' + r.id)"
                >
                    <i class="material-icons">open_in_new</i>
                </button>
            </td>
            <td>
                <button
                        v-tooltip="tooltipDel"
                        class="btn-small btn red"
                        @click="$emit('removeRecord', r.id)"
                >
                    <i class="material-icons">close</i>
                </button>
            </td>
        </tr>
        </transition-group>
    </table>

</template>

<script>
    export default {
        name: "history-table",
        props: {
            records: {
                required: true,
                type: Array
            },
            transit: {
                required: true,
                type: Boolean
            }
        },
        data: () => ({
            tooltip: '',
            tooltipDel: '',

            sortNumer: 1,
            sortAsk: true,
        }),
        created() {
            if( this.$store.getters.info.locale === 'ru-RU' ) {
                this.tooltip = 'Просмотр записи';
                this.tooltipDel = 'Удалить запись';
            }
            if( this.$store.getters.info.locale === 'en-US' ) {
                this.tooltip = 'Viewing a recording';
                this.tooltipDel = 'Remove record';
            }

            this.sorter( this.sortNumer )
        },
        methods: {
            sorter(n) {
                if(n === this.sortNumer) {
                    if(this.sortAsk) this.sortAsk = false;
                    else this.sortAsk = true;
                } else {
                    this.sortNumer = n;
                }
                this.$emit('sort',this.sortNumer,this.sortAsk);
            },

        }

    }
</script>

<style scoped lang="scss">
    table {

        th {
            cursor: default;
            white-space: nowrap;

            &.hoverEnb {

                &:hover {
                    background-color: #f6f6f7;
                    cursor: pointer;
                }

                span {
                    display: inline-block;
                    vertical-align: top;
                    visibility: hidden;

                    &:before {
                        content: '';
                        border: 5px solid;
                        border-color: transparent;
                        border-bottom-color: #444;
                        position: relative;
                        bottom: 11px;
                        left: 2px;
                    }

                    &.active {
                        visibility: visible;
                    }
                }
            }
        }

        &.sort-desk {
            th {

                &.hoverEnb {

                    span {

                        &:before {
                            border-color: transparent;
                            border-top-color: #444;
                            top: 14px;
                        }
                    }
                }

            }
        }
    }

    .transed .flip-list-move {
        transition: transform .25s;
    }

</style>
