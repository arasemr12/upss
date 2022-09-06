<template>
    <div v-if="$auth.loggedIn" class="w-full h-full flex flex-row justify-between gap-5">
        <div class="flex flex-col gap-10">
            <div class="flex flex-row items-center bg-gray-800 py-6 px-6 rounded-lg gap-4 cursor-pointer" @click.prevent="select(user._id)" v-for="user in users" :key="user._id">
                <i class="fa-solid fa-user py-2 px-2 rounded-full bg-gray-700"></i>
                <span>{{user.username}}</span>
            </div>
        </div>
        <div v-if="selected" class="w-full bg-gray-800 rounded-lg flex flex-col max-h-full gap-5 overflow-y-scroll">
            <message v-for="ms in msg" :key="ms._id" :message="ms"/>
            <form @submit.prevent="send" class="w-full flex flex-col gap-5">
                <input type="text" class="bg-gray-700 w-full" placeholder="Hi, how are you?" v-model="mes">
                <button class="green-btn" type="submit">send</button>
            </form>
        </div>
    </div>    
</template>

<script>
export default {
    name:'messages',
    data:() => {
        return{
            users:[],
            selected:false,
            msg:[],
            mes:null
        }
    },
    async created(){
        await this.fetchdata();
        setInterval(() => {
            this.fetchdata();
        }, 1000);
    },
    loading: false,
    methods:{
        async select(id){
            let res = await this.$axios.get(`/api/messages/${id}`);
            let data = res.data;

            this.selected = data.author;

            this.msg = data.msg;
        },
        async send(){
            let res = await this.$axios.post(`/api/messages/create`,{
                author:this.$auth.user._id,
                sending:this.selected._id,
                content:this.mes
            });
            
            let data = res.data;

            this.mes = "";
            await this.fetchdata();
        },
        async fetchdata(){
            let users = await this.$axios.get("/api/users/all");
            let data = users.data.users;

            this.users = data;

            if(this.selected){
                let res = await this.$axios.get(`/api/messages/${this.selected._id}`);
                data = res.data;

                this.selected = data.author;

                this.msg = data.msg;
            }
        }
    }
}
</script>