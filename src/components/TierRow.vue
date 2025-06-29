<script setup lang="ts">
import { ref, computed } from 'vue'
import { EllipsisVertical } from 'lucide-vue-next'

import ItemRow from '@/components/ItemRow.vue'
import InputField from '@/components/InputField.vue'
import ColorField from '@/components/ColorField.vue'
import DeleteButton from '@/components/DeleteButton.vue'
import ModalWrapper from '@/components/ModalWrapper.vue'

import type { Tier } from '@/interfaces/tierlist'

const props = defineProps<{ tier: Tier }>()
const emit = defineEmits(['update', 'delete'])

// Create a computed property for two-way binding
const tier = computed({
  get: () => props.tier,
  set: (value) => emit('update', value),
})

// Handle label change
function onLabelChanged(event: Event) {
  const target = event.target as HTMLInputElement
  if (target) {
    // Update label directly on the item
    tier.value.label = target.value
    console.log(`Label for ${tier.value.id} updated to "${tier.value.label}"`)
  }
}

// Handle color change
function onColorChanged(event: Event) {
  const target = event.target as HTMLInputElement
  if (target) {
    // Update color directly on the tier
    tier.value.colorHex = target.value
    console.log(`Color for ${tier.value.id} updated to "${tier.value.colorHex}"`)
  }
}

// Handle delete action
function onDelete() {
  if (
    !confirm(
      'Are you sure you want to delete this tier? All items in this tier list will be moved back to the deck.',
    )
  ) {
    return
  }

  emit('delete', tier.value.id)
  showEditor.value = false
}

// Show editor modal
const showEditor = ref(false)
</script>

<template>
  <div class="flex border border-black">
    <div
      :style="{ backgroundColor: tier.colorHex }"
      class="max-w-16 flex items-center text-black text-lg font-bold"
    >
      <input v-model="tier.label" class="w-full text-center" />
      <EllipsisVertical
        class="hiddenOnCapture handle size-12 hover:opacity-50 cursor-pointer"
        @click="showEditor = !showEditor"
      />
      <!-- Tier Editor -->
      <ModalWrapper v-model="showEditor">
        <div class="grid gap-2">
          <div class="flex gap-2">
            <InputField :value="tier.label" @input="onLabelChanged" />
            <ColorField :value="tier.colorHex" @input="onColorChanged" />
          </div>
          <DeleteButton @click="onDelete">Delete</DeleteButton>
        </div>
      </ModalWrapper>
    </div>
    <!-- Item list-->
    <ItemRow v-model="tier.items" class="flex-grow" />
  </div>
</template>
