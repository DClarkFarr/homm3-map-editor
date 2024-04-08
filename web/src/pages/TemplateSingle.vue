<script lang="ts" setup>
import { onMounted } from 'vue';
import useTemplateStore from '../stores/useTemplateStore';

const templateStore = useTemplateStore();

onMounted(() => {
    templateStore.getTemplate();
});
</script>
<template>
    <div class="template-single">
        <h1>Edit Template</h1>
    </div>
</template>
