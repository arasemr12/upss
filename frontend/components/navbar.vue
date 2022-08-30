<template>
    <nav class="w-full flex flex-col lg:flex-row items-center bg-gray-800 py-6 px-6 gap-10 mb-12">
        <div class="flex flex-row items-center justify-between w-full lg:w-auto">
            <h1 class="text-2xl font-bold uppercase">upss</h1>
            <i @click="nav = !nav" class="fa-solid fa-bars fa-2x lg:hidden cursor-pointer"></i>
        </div>
        <div v-if="nav" class="flex flex-col lg:flex-row items-center w-full justify-between gap-10">
            <div class="flex flex-col lg:flex-row items-center gap-5 w-full lg:w-auto">
                <nuxt-link class="nav-link" to="/">Home</nuxt-link>
            </div>
            <div class="flex flex-col lg:flex-row items-center gap-5 w-full lg:w-auto" v-if="$auth.loggedIn">
                <nuxt-link class="nav-link green-btn" to="/users/@me">@{{$auth.user.username}}</nuxt-link>
                <nuxt-link class="nav-link red-btn" to="/logout">logout</nuxt-link>
            </div>
            <div class="flex flex-col lg:flex-row items-center gap-5 w-full lg:w-auto" v-else>
                <nuxt-link class="nav-link green-btn" to="/register">register</nuxt-link>
                <nuxt-link class="nav-link green-btn" to="/login">login</nuxt-link>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    data:() => {
        return{
            nav:true
        }
    },
    created(){

    }
}
</script>