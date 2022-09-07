<template>
  <div class="w-full flex flex-col items-center gap-5">
    <div class="w-full flex flex-row items-center bg-gray-800 border-2 border-gray-700 rounded-lg p-1">
      <textarea ref="msginput" class="w-full focus:ring-0 rounded-none" placeholder="What's up?" cols="30" rows="1" v-model="msg"></textarea>
      <i @click.prevent="send" class="fa-solid fa-paper-plane mr-2 cursor-pointer"></i>
    </div>
    <div class="w-full">
      <nuxt-link to="/search" class="green-btn uppercase flex flex-row items-center w-full justify-between">Search <i class="fa-solid fa-magnifying-glass"></i></nuxt-link>
    </div>
    <div class="flex flex-col w-full items-center gap-4">
      <span>Page: {{page}}</span>
      <div class="w-full flex flex-row items-center justify-center gap-2">
        <button @click="changepage(Number(page)-1)" class="green-btn">{{Number(page)-1}}</button>
        <button @click="changepage(Number(page))" class="green-btn">{{Number(page)}}</button>
        <button @click="changepage(Number(page)+1)" class="green-btn">{{Number(page)+1}}</button>
      </div>
      <nuxt-link to="/all" class="link">See all posts.</nuxt-link>
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
  data: () => {
    return{
      msg:null,
      error:null,
      page:1,
      posts:[]
    }
  },
  mounted(){
    //console.log(this.$auth.loggedIn)
  },
  async created(){
    await this.fetchdata();
  },
  methods:{
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
    async fetchdata(){
      let page;

      page = await this.getparam("page");

      if(!page || page <= 0) page = 1;

      this.page = page;

      let res = await this.$axios.get("/api/posts?page="+page);

      let data = res.data;

      let posts = data.posts;

      if(!posts || posts.length <= 0) return this.$router.push("/all");

      posts.forEach((post) => {
        if(post.content.length >= 100){
          post.content = post.content.slice(0,100);
          post.long = true;
        }
      });

      this.posts = posts;
    },
    async changepage(id){
      let data = this.$route.query;

      data.page = id;

      this.$router.push({ path : '/', query : data });

      this.fetchdata();
    }
  }
}
</script>
