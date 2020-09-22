<template>
    <div class="page-racking">
        <SellList :sellType="'hot'"></SellList>
    </div>
</template>
<script>
import SellList from "@/components/SellList";
export default {
    components: {
        SellList,
    },
    data() {
        return {};
	},
	mounted(){

	},
    methods: {

	},
};
</script>
<style lang="scss">
</style>
