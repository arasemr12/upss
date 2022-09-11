<template>
    <div class="w-full h-full flex flex-col items-center gap-5">
        <h1 class="text-2xl font-bold">Most popular tags.</h1>
        <div class="w-full flex flex-col items-center" v-for="category in categories" :key="category._id">
            <nuxt-link class="text-lg uppercase underline text-blue-600" :to="`/category/${category.name}`">#{{category.name}}</nuxt-link>
        </div>
    </div>
</template>

<script>
export default {
    name:'category',
    data:() => {
        return{
            categories:[]
        }
    },
    async created(){
        let res = await this.$axios.get("/api/category/all");
        let data = res.data;

        this.categories = data.tags;

        console.log(data);
    }
}
</script>