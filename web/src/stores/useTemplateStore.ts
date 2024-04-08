import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../services/apiClient';

const useTemplateStore = defineStore('template', () => {
    const template = ref({});
    const isLoading = ref(false);

    const loadTemplate = async (id: string) => {
        isLoading.value = true;
        return apiClient.get(`/template/${id}`).then(result => {
            template.value = result.data;
            isLoading.value = false;
        });
    };

    return {
        template,
        isLoading,
        loadTemplate,
    };
});

export default useTemplateStore;
