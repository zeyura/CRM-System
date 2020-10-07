<template>
    <nav class="navbar grey lighten-5">
        <div class="nav-wrapper">
            <div class="navbar-left">
                <a class="trigger" @click.prevent="$emit('sidebarToggle')" >
                    <span></span><span></span><span></span>
                </a>
                <span class="black-text datetimer">{{data | date('datetime')}}</span>
            </div>

            <ul class="right">
                <li>
                    <a
                            class="dropdown-trigger black-text"
                            href="#"
                            data-target="dropdown"
                            ref="dropdown"
                    >
                        {{userName}}
                        <i class="material-icons right">arrow_drop_down</i>
                    </a>

                    <ul id='dropdown' class='dropdown-content'>
                        <li>
                            <router-link to="/profile" class="black-text">
                                <i class="material-icons">account_circle</i>{{'profile' | localize}}
                            </router-link>
                        </li>
                        <li class="divider" tabindex="-1"></li>
                        <li>
                            <a href="#" class="black-text" @click.prevent="logout">
                                <i class="material-icons">assignment_return</i>{{'logout' | localize}}
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "navbar",
        data: () => ({
            data: new Date(),
            interval: null,
            dropdown: null

        }),
        mounted() {
           this.dropdown = M.Dropdown.init(this.$refs.dropdown, { // https://materializecss.com/dropdown.html
               hover: false,
               constrainWidth: false,
               inDuration:  100,
               outDuration: 200,
               alignment: 'right'
           });
           this.interval = setInterval(() => {
               this.data = new Date();
           }, 1000)
        },
        computed: {
            userName() {
                return this.$store.getters.info.name;
            }
        },
        methods: {
            async logout() {
                await this.$store.dispatch('logout');
                this.$router.push('/login?state=logout');
            }
        },
        beforeDestroy() {
            clearInterval(this.interval);
            if( this.dropdown && this.dropdown.destroy ) this.dropdown.destroy();
        }
    }
</script>

<style lang="scss" scoped>
    .navbar { box-shadow: 0 2px 8px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.07), 0 1px 5px 0 rgba(0,0,0,0.1); position: fixed }

    .trigger {
        display: flex;
        flex-direction: column;
        cursor: pointer;
        margin-right: 28px;

        span {
            display: block;
            background-color: #333;
            width: 24px; height: 3px;
            margin: 2px 0;

            &:nth-child(2) {
                width:20px;
            }
        }
    }

    .dropdown-content {
        top: 94% !important;min-width: 170px;
    }

    @media (max-width: 479px) {
        .navbar {
            padding-right: 5px;
        }
        .datetimer {
            display: none;
        }
    }


</style>
