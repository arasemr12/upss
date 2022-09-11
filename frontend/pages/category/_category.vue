<template>
    <div class="w-full flex flex-col items-center gap-5" v-if="posts">
        <h1 class="text-2xl font-bold link">#{{$route.params.category}}</h1>
        <span class="text-xl">POSTS</span>
        <post v-for="post in posts" :key="post._id" :post="post"/>
    </div>
    <div v-else-if="error">
        {{error}}
    </div>
</template>

<script>
export default {
    name:'categorie',
    data:() => {
        return{
            posts:[],
            error:null
        }
    },
    async created(){
        let tag = this.$route.params.category;
        let res = await this.$axios.get("/api/category/"+tag+"/posts/");
        let data = res.data;
        
        if(!data.success) return this.error = data.message;
        this.posts = data.result;
    }
}
</script>