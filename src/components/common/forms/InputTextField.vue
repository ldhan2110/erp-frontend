<script setup>
    import { useLocale } from '@/composables';
    import { computed, defineEmits, defineProps } from 'vue';

    const props = defineProps({
        id: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        modelValue: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            required: false,
        },
        disabled: {
            type: Boolean,
            default: false
        },
        maxlength: {
            type: Number,
            required: false
        },
        required: {
            type: Boolean,
            default: true
        }
    });

    const { t } = useLocale();
    const emit = defineEmits(['update:modelValue'])
    const valueModel = computed({
        get: () => props.modelValue,
        set: v => emit('update:modelValue', v)
    })
</script>


<template>
    <FloatLabel variant="on">
        <InputText :id="id" :class="{ 'required-input': props.required }" v-model="valueModel" size="small" fluid :placeholder="t(placeholder)" :disabled="disabled" :maxlength="maxlength" />
        <label :for="id">
            {{ t(label) }}
            <span v-if="required" class="required-asterisk">*</span>
        </label>
    </FloatLabel>
</template>