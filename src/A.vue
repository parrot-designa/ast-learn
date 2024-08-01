<template>
    <p>A
        <AChild/>
    </p>
</template>

<script>
import  AChild  from './A-child.vue'

export default ({
    components: {
        AChild
    },
})
</script>
