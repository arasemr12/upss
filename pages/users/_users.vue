<template>
    <div class="flex flex-col w-full items-center gap-10" v-if="user">
        <span class="text-2xl border-b-2 border-b-red-600">{{user.fallowers.length}}</span>
        <div class="w-full flex flex-col items-center" v-if="$auth.loggedIn && $auth.user._id != user._id">
            <button ref="fallow" @click="fallow" class="w-full green-btn">fallow</button>
        </div>
        <div class="flex flex-col items-center w-full gap-5" v-if="$auth.loggedIn && $auth.user._id == user._id">
            <input class="w-full" type="file" ref="profileFile" @change="changeFile">
            <button class="green-btn w-full" @click="loadProfile">Load new profile photo!</button>
        </div>
        <div class="flex flex-col w-full items-center">
            <span class="text-gray-500">{{user.email}}</span>
            <span class="text-xl font-bold">@{{user.username}}</span>
        </div>
        <div class="w-full flex flex-col items-center gap-4">
            <h1 class="text-2xl font-bold uppercase">User posts</h1>
            <post v-for="post in posts" :key="post._id" :post="post"/>
        </div>
    </div>
    <div v-else>
        <div class="err" v-if="error">
            {{error}}
        </div>
    </div>
</template>

<script>
export default {
    data:() => {
        return{
            user:null,
            error:null,
            fallowing:false,
            posts:null,
            img:null
        }
    },
    async created(){
        let userid = this.$route.params.users;
        if(userid == "@me") {
            if(!this.$auth.loggedIn) return this.$router.push("/login");
            let res = await this.$axios.get(`/api/users/${this.$auth.user._id}`);
            res = res.data;
            if(!res.success) return this.error = res.message;

            this.user = res.user;
            this.posts = res.posts;
            //this.user = this.$auth.user;

            return this.check();
        }

        let res = await this.$axios.get(`/api/users/${userid}`);
        res = res.data;
        if(!res.success) return this.error = res.message;

        this.user = res.user;
        this.posts = res.posts;

        return this.check();
    },
    methods:{
        async changeFile(){
            await this.$refs;

            let profileFile = this.$refs.profileFile;

            let file = profileFile.files[0];

            let fileReader = new FileReader();

            fileReader.readAsDataURL(file);

            fileReader.addEventListener('load',(e) => {
                let result = e.target.result;

                this.img = result;
            });
        },
        async loadProfile(){
            let res = await this.$axios.post("/api/auth/profile/change",{
                profile:this.img
            });

            let data = res.data;

            if(data.success) return this.$router.push(`/users/${this.$auth.user._id}`)
        },
        async fallow(){
            if(!this.user || !this.$auth.loggedIn) return;
            let res = await this.$axios.get("/api/users/"+this.user._id+"/fallow");
            let data = res.data;

            if(data.fallowing) {
                this.user.fallowers.push(this.$auth.user._id);
            }else{
                delete this.user.fallowers.shift(0);
            }

            this.btn(data.fallowing);
        },
        async btn(ty){
            let fbtn = await this.$refs.fallow;

            if(ty) {
                this.$refs.fallow.classList.add("red-btn");
                this.$refs.fallow.classList.remove("green-btn");
                this.$refs.fallow.innerText = "unfollow";
            }else{
                this.$refs.fallow.classList.remove("red-btn");
                this.$refs.fallow.classList.add("green-btn");
                this.$refs.fallow.innerText = "follow";
            }
        },
        check(){
            if(!this.$auth.loggedIn || this.$auth.user._id == this.user._id) return;
            let fallowing = this.user.fallowers.find((e) => e == this.$auth.user._id);

            if(fallowing){
                this.btn(true);
            }else{
                this.btn(false);
            }
        }
    }
}
</script>