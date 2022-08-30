<template>
    <div class="flex flex-col w-full items-center gap-10" v-if="post">
        <div class="err w-full" v-if="error">
            {{error}}
        </div>
        <post :post="post"/>
        <button @click="deletepost" v-if="$auth.loggedIn && $auth.user._id == post.author._id" class="red-btn w-full">Delete post!</button>
        <div class="w-full flex flex-col items-center gap-10">
            <div class="w-full flex flex-row items-center bg-gray-800 border-2 border-gray-700 rounded-lg p-1">
                <textarea ref="msginput" class="w-full focus:ring-0 rounded-none" placeholder="I like this post!" cols="30" rows="1" v-model="com"></textarea>
                <i @click.prevent="sendcom" class="fa-solid fa-paper-plane mr-2 cursor-pointer"></i>
            </div>
            <comment v-for="comment in comments" :key="comment._id" :comment="comment"/>
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
            post:null,
            error:null,
            com:null,
            comments:null
        }
    },
    async created(){
        let postid = this.$route.params.id;
        let res = await this.$axios.get(`/api/posts/${postid}`);
        res = res.data;
        if(!res.success) return this.error = res.message;
        this.comments = res.comments;
        return this.post = res.post;
    },
    methods:{
        async deletepost(){
            let post = this.post;
            if(!post) return;

            let res = await this.$axios.get("/api/posts/"+post._id+"/delete");
            let data = res.data;
            if(!data.success) return this.error = data.message;
            this.$router.push("/");
        },
        async sendcom(){
            if(!this.post || !this.$auth.loggedIn) return;
            let res = await this.$axios.post("/api/posts/"+this.post._id+"/comments/create",{
                content:this.com
            });
            this.com = null;

            this.get();
        },
        async get(){
            let postid = this.$route.params.id;
            let res = await this.$axios.get(`/api/posts/${postid}`);
            res = res.data;
            if(!res.success) return this.error = res.message;
            this.comments = res.comments;
            return this.post = res.post;
        }
    }
}
</script>
