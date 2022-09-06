<template>
    <div class="w-full flex flex-col gap-5 border-2 border-gray-800 p-4 rounded-lg">
        <div class="w-full flex flex-col lg:flex-row justify-between items-center gap-4">
            <nuxt-link :to="`/users/${message.author._id}`" class="flex flex-col">
                <span class="text-xl">@{{message.author.username}}</span>
            </nuxt-link>
            <div>
                <span class="text-gray-500">{{message.createdAt}}</span>
            </div>
        </div>
        <div>
            <span class="w-full break-words whitespace-pre-wrap">{{message.content}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name:'message',
    props:['message'],
    created(){

    },
    methods:{

    }
}
</script>
