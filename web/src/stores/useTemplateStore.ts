import { defineStore } from 'pinia';
import { nextTick, readonly, ref } from 'vue';
import apiClient from '../services/apiClient';
import { ParsedTemplate } from '../types/Templates';
import { cloneDeep } from 'lodash';

const capitalize = (str: string, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match =>
        match.toUpperCase(),
    );

export const checkboxColumns = readonly([
    'towns are of same type',
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
    'match to town',
    'dirt',
    'sand',
    'grass',
    'snow',
    'swamp',
    'rough',
    'cave',
    'lava',
    'forge',
    'neutral',
]);

export const selectColumns = readonly(['strength']);

export const textColumns = readonly(['name']);

export const selctColumnOptions = readonly({
    strength: ['weak', 'avg', 'strong'],
});

export const wideColumns = readonly(['high', 'low', 'density', 'value']);

const useTemplateStore = defineStore('template', () => {
    const parsedTemplate = ref<ParsedTemplate | null>(null);
    const isLoading = ref(false);

    const loadTemplate = async (id: string) => {
        isLoading.value = true;
        return apiClient.get(`/template/${id}`).then(result => {
            parsedTemplate.value = result.data;

            parsedTemplate.value!.labels =
                parsedTemplate.value?.labels.map(l => l.toLowerCase()) || [];

            parsedTemplate.value!.blocks =
                parsedTemplate.value?.blocks.map(block => {
                    return block.filter(arr => {
                        return arr.length > 1;
                    });
                }) || [];

            isLoading.value = false;
        });
    };

    const duplicateBlock = (i: number) => {
        const toCopy =
            parsedTemplate.value?.blocks[i] ||
            parsedTemplate.value?.blocks[
                (parsedTemplate.value?.blocks?.length || 1) - 1
            ];

        if (toCopy) {
            parsedTemplate.value!.blocks.push(cloneDeep(toCopy));
        }
    };

    const removeBlock = async (i: number) => {
        const toSet = [...parsedTemplate.value!.blocks];
        parsedTemplate.value!.blocks = [];
        await nextTick();

        toSet.splice(i, 1);

        console.log('toSet', toSet);

        parsedTemplate.value!.blocks = toSet;
    };

    const updateBlock = (index: number, data: (boolean | string)[][]) => {
        const labels = parsedTemplate.value?.labels || [];
        const toSet = data.map(row => {
            return row.map((cell, i) => {
                if (checkboxColumns.includes(labels[i])) {
                    return cell ? 'x' : '';
                }

                return String(cell) as string;
            });
        });

        parsedTemplate.value!.blocks.splice(index, 1, toSet);
    };

    const saveToDownload = () => {
        const headers = (parsedTemplate.value?.headers || [])
            .map(v => (v.startsWith('T:') || v.includes('empty') ? '' : v))
            .join('\t');

        const categories = (parsedTemplate.value?.categories || [])
            .map(v => (v.startsWith('T:') || v.includes('empty') ? '' : v))
            .join('\t');

        const labels = (parsedTemplate.value?.labels || [])
            .map(v => (v.startsWith('T:') || v.includes('empty') ? '' : v))
            .map(v => capitalize(v, true))
            .join('\t');

        const blocks = (
            JSON.parse(
                JSON.stringify(parsedTemplate.value?.blocks || []),
            ) as string[][][]
        ).map(block => {
            return [
                ...block.map(row => {
                    const mapped = row
                        .map(cell => {
                            if (typeof cell === 'boolean') {
                                return cell ? 'x' : '';
                            }
                            return cell;
                        })
                        .join('\t');

                    return mapped;
                }),
                Array(parsedTemplate.value?.labels.length || 0)
                    .fill('')
                    .join('\t'),
            ];
        });

        console.log('blocks was', blocks);

        const lines = [
            headers,
            categories,
            labels,
            ...blocks.flatMap(v => v),
        ].join('\r\n');

        const blob = new Blob([lines], { type: 'text/text' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rmg.txt';
        a.click();
    };

    return {
        checkboxColumns,
        selectColumns,
        selctColumnOptions,
        textColumns,
        parsedTemplate,
        isLoading,
        loadTemplate,
        duplicateBlock,
        removeBlock,
        updateBlock,
        saveToDownload,
    };
});

export default useTemplateStore;
