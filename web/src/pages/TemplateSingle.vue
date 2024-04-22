<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import useTemplateStore from '../stores/useTemplateStore';
import { useRoute } from 'vue-router';
import BlockManager from '../components/Block/BlockManager.vue';

const templateStore = useTemplateStore();
const route = useRoute();

const template = computed(() => templateStore.parsedTemplate);

const onClickSave = () => {
    templateStore.saveToDownload();
};

onMounted(() => {
    const templateId = route.params.id.toString();

    if (templateId) {
        templateStore.loadTemplate(templateId);
    }
});
</script>
<template>
    <div class="template-single">
        <h1>Edit Template</h1>
        <button class="btn btn-lg btn-primary" @click="onClickSave">
            Save Template
        </button>

        <template v-if="!templateStore.isLoading && template">
            <BlockManager
                v-for="(block, i) in template.blocks"
                :block="block"
                :categories="template.categories"
                :labels="template.labels"
                :headers="template.headers"
                :key="i"
                @duplicate="() => templateStore.duplicateBlock(i)"
                @remove="() => templateStore.removeBlock(i)"
                @change="data => templateStore.updateBlock(i, data)"
            />
        </template>
    </div>
</template>
