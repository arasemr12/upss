<template>
    <div class="w-full flex flex-col gap-5 border-2 border-gray-800 p-4 rounded-lg">
        <div class="w-full flex flex-col lg:flex-row justify-between items-center gap-4">
            <div class="flex flex-row items-center gap-x-4">
            <img :src="post.author.profilePhoto" alt="" width="64" height="64" class="rounded-full w-[64px] h-[64px]">
            <nuxt-link :to="`/users/${post.author._id}`" class="flex flex-col">
                <span class="text-gray-500">{{post.author.email}}</span>
                <span class="text-xl">@{{post.author.username}}</span>
            </nuxt-link>
            </div>
            <div>
            <span class="text-gray-500">{{post.createdAt}}</span>
            </div>
        </div>
        <div class="p-4 flex flex-col">
            <span class="w-full focus:ring-0 bg-gray-900 resize-none p-0 whitespace-pre-wrap max-w-full break-words" :ref="`${post._id}-postcontent`">{{post.html}}</span>
            <nuxt-link :to="`/posts/${post._id}`" class="link">read more</nuxt-link>
        </div>
        <div class="w-full p-4 flex flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-2">
            <i :ref="`like${post._id}`" :class="`fa-solid fa-heart cursor-pointer ${ $auth.loggedIn ? post.likes.find((e) => e == $auth.user._id) ? 'text-red-600' : '' : ''}`" @click="like(post._id)"></i> <span :ref="`liketext${post._id}`">{{post.likes.length}}</span>
            </div>
            <nuxt-link :to="`/posts/${post._id}#comment`" class="flex flex-row items-center gap-2">
            <i class="fa-solid fa-comments cursor-pointer"></i>
            </nuxt-link>
        </div>
    </div>
</template>

<script>
export default {
    name:'post',
    props:['post'],
    async created(){
        let content = this.post.content;
        let match = content.match(/(^|\s)(#[a-z\d-]+)/ig);

        if(match){
            match.forEach((m) => {
                content = content.replaceAll(m,`<a class="link" href="/category/${m.trim().slice(1)}">#${m.trim().slice(1)}</a> `);
                m = m.trim();
                m = m.slice(1);
            });
        }
        
        await this.$refs;

        this.$refs[`${this.post._id}-postcontent`].innerHTML = content;
    },
    methods:{
        async like(postid){
            let refs = await this.$refs[`like${postid}`];
            let res = await this.$axios.get("/api/posts/"+postid+"/like");
            let data = res.data;
            if(!data.success) return;

            if(data.liked){
                this.$refs[`like${postid}`].classList.add("text-red-600");
            }else{
                this.$refs[`like${postid}`].classList.remove("text-red-600");
            }

            this.$refs[`liketext${postid}`].innerText = data.newlikes;
        },
    }
}
</script>