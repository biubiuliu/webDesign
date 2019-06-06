<template>
    <div class="app-container preview">
        <img v-if="previewImg" :src="previewImg" alt="">
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "Preview",
        data() {
        return {}
        },
        computed: {
        ...mapGetters([
            'previewImg'
        ])
        },
        created() {
            if (!this.previewImg) {
                this.$router.push('/')
            }
        },
        methods: {}
    }
</script>

<style  scoped>
.preview{
    width: 100%;
    height: 100%;
    padding: 50px;
    background: #293039 !important
}
.preview img{
    display: block;
    margin: 20px auto 0 auto;
}
</style>
