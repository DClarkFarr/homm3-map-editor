<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';

import {
    checkboxColumns,
    selectColumns,
    textColumns,
    selctColumnOptions,
    wideColumns,
} from '../../stores/useTemplateStore';

const emit = defineEmits<{
    (e: 'remove'): void;
    (e: 'duplicate'): void;
    (e: 'change', value: (string | boolean)[][]): void;
}>();

const props = defineProps<{
    block: string[][];
    categories: string[];
    labels: string[];
    headers: string[];
}>();

const tableCols = computed(() => {
    return Math.max(85, props.headers.length || 0);
});

const isCheckboxCol = (label: string) => {
    return checkboxColumns.includes(label);
};

const isTextCol = (label: string) => {
    return textColumns.includes(label);
};

const isSelectCol = (label: string) => {
    return selectColumns.includes(label);
};

const isWideCol = (label: string) => {
    return wideColumns.includes(label);
};

const makeFormState = () => {
    return props.block.map(row => {
        return row.map((col, i) => {
            if (isCheckboxCol(props.labels[i])) {
                return col === 'x';
            }
            return col;
        });
    });
};

const form = reactive(makeFormState());

const getSelectColOptions = (label: keyof typeof selctColumnOptions) => {
    return selctColumnOptions[label as keyof typeof selctColumnOptions];
};

const onRemoveRow = (index: number) => {
    form.splice(index, 1);
};

const onAddRow = () => {
    form.push(
        Array.from({ length: props.labels.length }, (_, index) => {
            if (isCheckboxCol(props.labels[index])) {
                return false;
            }
            return '';
        }),
    );
};

const onDuplicateBlock = () => {
    emit('duplicate');
};

const onRemoveBlock = () => {
    emit('remove');
};

const getZoneId = (rowId: number) => {
    return form[rowId][3];
};

watch(
    form,
    () => {
        const toEmit = JSON.parse(JSON.stringify(form));
        emit('change', toEmit);
    },
    {
        deep: true,
    },
);
</script>

<template>
    <div class="block-manager">
        <div class="table-wrapper">
            <table cellpadding="0" cellspacing="0">
                <tr class="tr headers">
                    <td></td>
                    <td v-for="i in tableCols" :key="`${headers[i]}-${i}`">
                        {{ headers[i - 1] }}
                    </td>
                </tr>

                <tr class="tr categories">
                    <td></td>
                    <td v-for="i in tableCols" :key="`${categories[i]}-${i}`">
                        {{ categories[i - 1] }}
                    </td>
                </tr>

                <tr class="tr block-labels">
                    <td></td>
                    <td v-for="(li, i) in labels" :key="`${labels[i]}-${i}`">
                        {{ li }}
                    </td>
                </tr>
                <tr class="tr block" v-for="(row, ri) in form" :key="`${ri}`">
                    <v-tooltip activator="parent" location="start">
                        {{ getZoneId(ri) }}
                    </v-tooltip>
                    <td>
                        <button
                            class="btn btn-sm btn-danger"
                            @click="onRemoveRow(ri)"
                        >
                            &times;
                        </button>
                    </td>
                    <td v-for="(c, ci) in row" :key="`${ri}-${ci}`">
                        <template v-if="isCheckboxCol(labels[ci])">
                            <label>
                                <input type="checkbox" v-model="form[ri][ci]" />
                            </label>
                        </template>
                        <template v-else-if="isTextCol(labels[ci])">
                            <input
                                type="text"
                                class="input input-clear"
                                v-model="form[ri][ci]"
                            />
                        </template>
                        <template v-else-if="isSelectCol(labels[ci])">
                            <select
                                class="input input-clear"
                                v-model="form[ri][ci]"
                            >
                                <option
                                    v-for="option in getSelectColOptions(
                                        labels[
                                            ci
                                        ] as keyof typeof selctColumnOptions,
                                    )"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }}
                                </option>
                            </select>
                        </template>
                        <template v-else>
                            <input
                                type="number"
                                class="input input-clear"
                                :class="{ 'input-wide': isWideCol(labels[ci]) }"
                                v-model="form[ri][ci]"
                            />
                        </template>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <button
                            class="btn btn-sm btn-primary"
                            @click="onAddRow"
                        >
                            Add Row
                        </button>
                    </td>
                    <td :colspan="labels.length - 3"></td>
                </tr>
            </table>
        </div>
    </div>

    <div class="actions">
        <div>
            <button class="btn btn-primary" @click="onDuplicateBlock">
                Duplicate
            </button>
        </div>
        <div>
            <button class="btn btn-danger" @click="onRemoveBlock">
                Remove
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.actions {
    display: flex;
    margin-top: 20px;
    column-gap: 10px;
}
.input {
    padding: 5px 10px;
}
.input-clear {
    border: none;
    display: block;
    width: 60px;

    &:hover,
    &:focus {
        border: none;
        outline: 0;
    }
}
.input-wide {
    width: 100px;
}
.block-manager {
    margin-top: 40px;
}

tr {
    td {
        padding: 5px;
        width: 25px;

        label {
            display: inline-block;
            padding: 0 5px;
        }
    }
}
.tr.headers td {
    white-space: nowrap;
    background: #ebebeb;
    font-size: 10px;
}

.tr.categories td {
    white-space: nowrap;
    background: #bbb;
    font-size: 10px;
}

.tr.block-labels td {
    white-space: nowrap;
    background: #bbe9fc;
    border: solid 1px #666;
    font-size: 10px;
}
.tr.block td {
    white-space: nowrap;
    background: #fff;
    border: solid 1px #666;
    padding: 0;
}

.table-wrapper {
    overflow-x: auto;
    max-width: 100%;
}
</style>
