<template>
    <div class="w-full h-full">
        <form action="/" @submit.prevent="find" method="post">
            <div>
                <input v-model="s" type="text" placeholder="Search keyword.">
            </div>
            <div>
                <button type="submit" class="uppercase green-btn">Search</button>
            </div>
            <div :class="`bg-red-100 text-red-600 py-3 px-3 rounded-full duration-300 ${error ? 'visible opacity-100' : 'invisible opacity-0'}`">
                {{error}}
            </div>
        </form>
        <div class="w-full flex flex-col items-center gap-5">
            <post v-for="res in result" :key="res._id" :post="res"/>
        </div>
    </div>
</template>

<script>
export default {
    name:'search',
    data:() => {
        return{
            s:null,
            error:null,
            result:[]
        }
    },
    methods:{
        async find(){
            this.result = [];
            this.error = null;

            let res = await this.$axios.post("/api/posts/find",{
                keyword:this.s
            });
            let data = res.data;

            if(!data.success) return this.error = data.message;
            this.result = data.result;
        }
    }
}
</script>