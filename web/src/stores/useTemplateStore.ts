import { defineStore } from 'pinia';
import { readonly, ref } from 'vue';
import apiClient from '../services/apiClient';
import { ParsedTemplate } from '../types/Templates';

const useTemplateStore = defineStore('template', () => {
    const parsedTemplate = ref<ParsedTemplate | null>(null);
    const isLoading = ref(false);

    const checkboxColumns = readonly([
        'human start',
        'computer start',
        'treasure',
        'castle',
        'rampart',
        'tower',
        'inferno',
        'necropolis',
        'dungeon',
        'stronghold',
        'fortress',
        'elemental',
        'Match to town',
        'dirt',
        'sand',
        'grass',
        'snow',
        'swamp',
        'rough',
        'cave',
        'lava',
    ]);

    const selectColumns = readonly(['strength']);

    const textColumns = readonly(['name']);

    const selctColumnOptions = readonly({
        strength: ['weak', 'avg', 'strong'],
    });

    const loadTemplate = async (id: string) => {
        isLoading.value = true;
        return apiClient.get(`/template/${id}`).then(result => {
            parsedTemplate.value = result.data;

            parsedTemplate.value!.blocks =
                parsedTemplate.value?.blocks.map(block => {
                    return block.filter(arr => {
                        return arr.length > 1;
                    });
                }) || [];

            console.log('blocks', JSON.stringify(parsedTemplate.value?.blocks));

            isLoading.value = false;
        });
    };

    return {
        checkboxColumns,
        selectColumns,
        selctColumnOptions,
        textColumns,
        parsedTemplate,
        isLoading,
        loadTemplate,
    };
});

export default useTemplateStore;
