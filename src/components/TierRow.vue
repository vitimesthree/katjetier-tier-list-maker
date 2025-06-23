<script setup lang="ts">
import { ref, computed } from 'vue'
import { EllipsisVertical } from 'lucide-vue-next'

import ItemRow from '@/components/ItemRow.vue'
import InputField from '@/components/InputField.vue'
import ModalWrapper from '@/components/ModalWrapper.vue'

import type { Tier } from '@/interfaces/tierlist'

const props = defineProps<{ tier: Tier }>()
const emit = defineEmits(['update'])

// Create a computed property for two-way binding
const tier = computed({
  get: () => props.tier,
  set: (value) => emit('update', value),
})

// Show editor modal
const showEditor = ref(false)
</script>
<template>
  <div class="flex border border-black">
    <div
      :style="{ backgroundColor: tier.colorHex }"
      class="max-w-16 flex items-center text-black text-lg font-bold"
    >
      <input v-model="tier.label" class="w-full" />
      <EllipsisVertical class="handle" @click="showEditor = !showEditor" />
      <!-- Tier Editor -->
      <ModalWrapper v-model="showEditor">
        <div
          class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-96 p-4 grid gap-2 text-white bg-black border rounded-md shadow z-10 mt-2"
        >
          <InputField :value="tier.label" />
        </div>
      </ModalWrapper>
    </div>
    <!-- Item list-->
    <ItemRow v-model="tier.items" class="flex-grow" />
  </div>
</template>
