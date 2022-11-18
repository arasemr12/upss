<template>
  <div class="w-full flex flex-col items-center gap-5">
    <div class="w-full flex flex-row items-center bg-gray-800 border-2 border-gray-700 rounded-lg p-1">
      <textarea ref="msginput" class="w-full focus:ring-0 rounded-none" placeholder="What's up?" cols="30" rows="1" v-model="msg"></textarea>
      <i @click.prevent="send" class="fa-solid fa-paper-plane mr-2 cursor-pointer"></i>
    </div>
    <div class="w-full">
      <nuxt-link to="/search" class="green-btn uppercase flex flex-row items-center w-full justify-between">Search <i class="fa-solid fa-magnifying-glass"></i></nuxt-link>
    </div>
    <div class="w-full">
      <nuxt-link to="/category" class="green-btn uppercase flex flex-row items-center w-full justify-between">Categories <i class="fa-solid fa-hashtag"></i></nuxt-link>
    </div>
    <div class="flex flex-col w-full items-center gap-4">
      <span>Page: {{page}}</span>
      <div class="w-full flex flex-row items-center justify-center gap-2">
        <button @click="changepage(Number(page)-1)" class="green-btn">{{Number(page)-1}}</button>
        <button @click="changepage(Number(page))" class="green-btn">{{Number(page)}}</button>
        <button @click="changepage(Number(page)+1)" class="green-btn">{{Number(page)+1}}</button>
      </div>
      <a ref="fetch_all" @click="fetchAllPosts" class="link cursor-pointer">See all posts.</a>
      <a ref="fetch_one" @click="fetchPosts" class="link cursor-pointer">See fallowing posts.</a>
    </div>
    <div class="w-full flex flex-col items-center gap-10">
      <post v-for="post in posts" :key="post._id" :post="post"/>
    </div>
    <div class="flex flex-col w-full items-center gap-4">
      <span>Page: {{page}}</span>
      <div class="w-full flex flex-row items-center justify-center gap-2">
        <button @click="changepage(Number(page)-1)" class="green-btn">{{Number(page)-1}}</button>
        <button @click="changepage(Number(page))" class="green-btn">{{Number(page)}}</button>
        <button @click="changepage(Number(page)+1)" class="green-btn">{{Number(page)+1}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  middleware: ["auth"],
  data: () => {
    return{
      msg:null,
      error:null,
      page:1,
      posts:[]
    }
  },
  mounted(){
    
  },
  async created(){
    console.log(this.$store)
    if(!process.browser) return;
    if(this.$auth.loggedIn) return this.fetchPosts();
    this.fetchAllPosts();
  },
  methods:{
    async refreshBtns(){
      await this.$refs;

      let fetch_all = this.$refs.fetch_all;
      let fetch_one = this.$refs.fetch_one;

      fetch_all.classList.remove("hidden");
      fetch_all.classList.remove("block");
      fetch_one.classList.remove("hidden");
      fetch_one.classList.remove("block");
    },
    async fetchPosts(){
      await this.refreshBtns();

      let fetch_all = this.$refs.fetch_all;
      let fetch_one = this.$refs.fetch_one;

      fetch_all.classList.toggle("block");
      fetch_one.classList.toggle("hidden");

      let page = await this.getparam("page");

      if(!page || page <= 0) page = 1;

      this.page = page;

      let res = await this.$axios.get("/api/posts?page="+page);

      let data = res.data;

      let posts = data.posts;

      if(posts.length < 1) return this.fetchAllPosts();

      posts.forEach((post) => {
        if(post.content.length >= 100){
          post.content = post.content.slice(0,100);
          post.long = true;
        }
      });

      this.posts = posts;
    },
    async fetchAllPosts(){
      await this.refreshBtns();

      let fetch_all = this.$refs.fetch_all;
      let fetch_one = this.$refs.fetch_one;

      fetch_all.classList.toggle("hidden");
      fetch_one.classList.toggle("block");

      let page = await this.getparam("page");

      if(!page || page <= 0) page = 1;

      this.page = page;

      let res = await this.$axios.get("/api/posts/all?page="+page);

      let data = res.data;

      let posts = data.posts;

      posts.forEach((post) => {
        if(post.content.length >= 100){
          post.content = post.content.slice(0,100);
          post.long = true;
        }
      });

      this.posts = posts;
    },
    async like(postid){
      let res = await this.$axios.get("/api/posts/"+postid+"/like");
      let data = res.data;
      if(!data.success) return;

      if(data.liked){
        this.$refs[`like${postid}`][0].classList.add("text-red-600");
      }else{
        this.$refs[`like${postid}`][0].classList.remove("text-red-600");
      }

      this.$refs[`liketext${postid}`][0].innerText = data.newlikes;
    },
    async getparam(name){
      let search = this.$route.query;

      return search[name];
    },
    async send(){
      this.$refs.msginput.classList.remove("border-b-2");
      this.$refs.msginput.classList.remove("border-red-600");
      this.error = null;

      let msg = this.msg;
      if(!msg) {
        this.$refs.msginput.focus();
        this.$refs.msginput.classList.add("border-b-2");
        return this.$refs.msginput.classList.add("border-red-600");
      };

      let res = await this.$axios.post("/api/posts/create",{
        content:this.msg
      });

      let data = res.data;

      if(!data.success) return this.error = data.message;

      this.$router.push(`/posts/${data.post._id}`);
    },
    async changepage(id){
      let data = this.$route.query;

      data.page = id;

      this.$router.push({ path : '/', query : data });

      if(this.$auth.loggedIn) return this.fetchPosts();
      this.fetchAllPosts();
    }
  }
}
</script>
