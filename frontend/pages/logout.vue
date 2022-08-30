<template>
    <div>
        <span>logouting..</span>
    </div>
</template>

<script>
export default {
    async created(){
        await this.$auth.logout();
        this.$router.push("/");
    }
}
</script>