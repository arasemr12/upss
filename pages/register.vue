<template>
    <div class="w-full flex flex-col items-center">
        <form class="w-full flex flex-col items-center" action="/register" method="post" @submit.prevent="register">
            <div>
                <label for="email">email</label>
                <input type="email" id="email" name="email" v-model="email" autocomplete="off" placeholder="email" required>
            </div>
            <div>
                <label for="username">username</label>
                <input type="text" id="username" name="username" v-model="username" autocomplete="off" placeholder="username" required>
            </div>
            <div>
                <label for="password">password</label>
                <input type="password" id="password" name="password" v-model="password" autocomplete="off" placeholder="password" required>
            </div>
            <button class="green-btn" style="width:100%;" type="submit">register</button>
            <div class="err" :class="error ? 'opacity-100 visible' : 'opacity-0 invisible'">
                <span>{{error}}</span>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'register',
    middleware: ["noauth"],
    data() {
        return {
            email: null,
            username:null,
            password:null,
            error:null
        }
    },
    methods:{
        register:function(){
            this.error = null;

            this.$axios.post("/api/auth/register",{
                email:this.email,
                username:this.username,
                password:this.password
            }).then(async(res) => {
                res = res.data;
                if(res.success) return this.$router.push("/login");
                this.error = res.message;
            })
            .catch((err) => {
                this.error = err;
            });
        }
    }
}
</script>