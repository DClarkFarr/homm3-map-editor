<script lang="ts" setup>
import useTemplatesStore from '../stores/useTemplatesStore';

const templatesStore = useTemplatesStore();
</script>
<template>
    <div>
        <h1>HOMM3 Templates</h1>
        <div class="templates">
            <div
                class="template"
                v-for="(t, i) in templatesStore.templates"
                :key="`${t.id}-${i}`"
            >
                <div>
                    {{ t.name }}
                </div>
                <div class="template__actions">
                    <RouterLink
                        :to="{ name: 'template', params: { id: t.id } }"
                        class="btn btn-primary"
                        >View</RouterLink
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.template {
    display: flex;
    align-items: center;
    background: #eaeaea;
    border-radius: 4px;
    margin-bottom: 8px;
    padding: 8px 16px;

    &__actions {
        margin-left: auto;
    }
}
</style>
