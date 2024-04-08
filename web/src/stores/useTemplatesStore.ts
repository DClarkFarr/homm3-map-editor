import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import { Template } from '../types/Templates';
import apiClient from '../services/apiClient';

const useTemplatesStore = defineStore('templates', () => {
  const templates = ref<Template[]>([]);
  const loadingPromise = ref<Promise<Template[]> | null>(null);

  const loadTemplates = async () => {
    loadingPromise.value = apiClient
      .get('/template')
      .then(result => result.data);

    loadingPromise.value.then(ts => {
      templates.value = ts;
    });
  };

  onMounted(() => {
    if (!loadingPromise.value && !templates.value.length) {
      loadTemplates();
    }
  });

  return {
    templates,
    loadTemplates,
  };
});

export default useTemplatesStore;
