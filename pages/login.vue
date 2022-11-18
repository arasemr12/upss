<template>
    <div class="w-full flex flex-col items-center">
        <form class="w-full flex flex-col items-center" action="/login" method="post" @submit.prevent="logindata">
            <div>
                <label for="email">email</label>
                <input type="email" name="email" id="email" v-model="login.email" autocomplete="off" placeholder="email" required>
            </div>
            <div>
                <label for="password">password</label>
                <input type="password" name="password" id="password" v-model="login.password" autocomplete="off" placeholder="password" required>
            </div>
            <button style="width:100%;" class="green-btn" type="submit">login</button>
            <div class="err" :class="error ? 'opacity-100 visible' : 'opacity-0 invisible'">
                <span>{{error}}</span>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'login',
    middleware: ["noauth"],
    data() {
        return {
            error:'',
            login: {
                email: '',
                password: ''
            }
        }
    },
    methods:{
        logindata:async function(){
            this.error = null;
            let response = await this.$auth.loginWith('local', { data: this.login });
            console.log(response)
            if(response.data.success) this.$router.push("/");
            if(!response.data.success) this.error = response.data.message;
        }
    }
}
</script>