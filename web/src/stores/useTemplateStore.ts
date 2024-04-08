import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../services/apiClient';
import { ParsedTemplate } from '../types/Templates';

const useTemplateStore = defineStore('template', () => {
    const parsedTemplate = ref<ParsedTemplate | null>(null);
    const isLoading = ref(false);

    const loadTemplate = async (id: string) => {
        isLoading.value = true;
        return apiClient.get(`/template/${id}`).then(result => {
            parsedTemplate.value = result.data;
            isLoading.value = false;
        });
    };

    return {
        parsedTemplate,
        isLoading,
        loadTemplate,
    };
});

export default useTemplateStore;
