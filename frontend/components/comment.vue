<template>
    <div class="w-full flex flex-col gap-5 border-2 border-gray-800 p-4 rounded-lg">
        <div class="w-full flex flex-col lg:flex-row justify-between items-center gap-4">
            <div class="flex flex-row items-center gap-x-4">
            <i class="fa-solid fa-user fa-2x bg-gray-700 py-4 px-4 rounded-full"></i>
            <nuxt-link :to="`/users/${comment.author._id}`" class="flex flex-col">
                <span class="text-gray-500">{{comment.author.email}}</span>
                <span class="text-xl">@{{comment.author.username}}</span>
            </nuxt-link>
            </div>
            <div>
            <span class="text-gray-500">{{comment.createdAt}}</span>
            </div>
        </div>
        <div class="p-4">
            <textarea class="w-full focus:ring-0 bg-gray-900 resize-none p-0" cols="30" rows="3" v-model="comment.content" readonly></textarea>
        </div>
        <div class="w-full p-4 flex flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-2">
                <i :ref="`like${comment._id}`" :class="`fa-solid fa-heart cursor-pointer`" @click="like(comment._id)"></i> <span :ref="`liketext${comment._id}`">0</span>
            </div>
            <button class="flex flex-row items-center green-btn uppercase">Reply</button>
        </div>
    </div>
</template>

<script>
export default {
    name:'comment',
    props:['comment'],
    created(){

    },
    methods:{
        async like(postid){

        },
    }
}
</script>
