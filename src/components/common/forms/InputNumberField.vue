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
        min: {
            type: Number,
            required: false
        },
        max: {
            type: Number,
            required: false
        },
        minFractionDigits: {
            type: Number,
            required: false
        },
        maxFractionDigits: {
            type: Number,
            required: false
        },
        prefix: {
            type: String,
            required: false
        },
        suffix: {
            type: String,
            required: false
        },
        showClear: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
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
        <InputNumber :id="id" v-model="valueModel" fluid size="small"  :placeholder="t(placeholder)" :disabled="disabled" :maxlength="maxlength" :min="min" :max="max" :minFractionDigits="minFractionDigits" :maxFractionDigits="maxFractionDigits" :prefix="prefix" :suffix="suffix" :showClear="showClear" :class="{ 'required-input': required }" />
        <label :for="id">
            {{ t(label) }}
            <span v-if="required" class="required-asterisk">*</span>
        </label>
    </FloatLabel>
</template>