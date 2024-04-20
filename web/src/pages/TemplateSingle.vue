<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import useTemplateStore from '../stores/useTemplateStore';
import { useRoute } from 'vue-router';

const templateStore = useTemplateStore();
const route = useRoute();

const template = computed(() => templateStore.parsedTemplate);

const tableCols = computed(() => {
    return Math.max(85, template.value?.headers?.length || 0);
});

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

        <div class="table-wrapper">
            <table
                cellpadding="0"
                cellspacing="0"
                v-if="!templateStore.isLoading && template"
            >
                <tr class="tr headers">
                    <td
                        v-for="i in tableCols"
                        :key="`${template.headers[i]}-${i}`"
                    >
                        {{ template.headers[i - 1] }}
                    </td>
                </tr>

                <tr class="tr categories">
                    <td
                        v-for="i in tableCols"
                        :key="`${template.categories[i]}-${i}`"
                    >
                        {{ template.categories[i - 1] }}
                    </td>
                </tr>

                <template v-for="(bs, bi) in template.blocks" :key="bi">
                    <tr class="tr block-labels">
                        <td
                            v-for="(li, i) in template.labels"
                            :key="`${template.labels[i]}-${i}`"
                        >
                            {{ li }}
                        </td>
                    </tr>
                    <tr
                        class="tr block"
                        v-for="(b, bii) in bs"
                        :key="`${bi}-${bii}`"
                    >
                        <td
                            v-for="(c, i) in b"
                            :key="`${template.labels[i]}-${bi}-${bii}-${i}`"
                        >
                            {{ c }}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="100%">&nbsp;</td>
                    </tr>
                </template>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
tr {
    td {
        padding: 5px;
    }
}
.tr.headers td {
    white-space: nowrap;
    background: #ebebeb;
}

.tr.categories td {
    white-space: nowrap;
    background: #bbb;
}

.tr.block-labels td {
    white-space: nowrap;
    background: #bbe9fc;
    border: solid 1px #666;
}
.tr.block td {
    white-space: nowrap;
    background: #fff;
    border: solid 1px #666;
}

.table-wrapper {
    overflow-x: auto;
    max-width: 100%;
}
</style>
