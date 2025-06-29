<script setup lang="ts">
import { ref, computed } from 'vue'

import InputField from '@/components/InputField.vue'
import DeleteButton from '@/components/DeleteButton.vue'
import ModalWrapper from '@/components/ModalWrapper.vue'

import type { Item } from '@/interfaces/tierlist'

const props = defineProps<{ item: Item }>()
const emit = defineEmits(['update', 'delete'])

// Create a computed property for two-way binding
const item = computed({
  get: () => props.item,
  set: (value) => emit('update', value),
})

const showEditor = ref(false)

// Handle label change
function onLabelChanged(event: Event) {
  const target = event.target as HTMLInputElement
  if (target) {
    // Update label directly on the item
    item.value.label = target.value
    console.log(`Label for ${item.value.id} updated to "${item.value.label}"`)
  }
}

// Handle image upload and emit the updated image
function onFileChanged(event: Event) {
  const target = event.target as HTMLInputElement
  if (target && target.files && target.files.length > 0) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      // Update image as base64 image data
      item.value.image = reader.result as string
      console.log(`Image for ${item.value.id} updated (Base64URLString)`)
    }
    reader.readAsDataURL(file)
  }
}

// Handle delete action
function onDelete() {
  if (!confirm('Are you sure you want to delete this item?')) {
    return
  }

  emit('delete', item.value.id)
  showEditor.value = false
}
</script>

<template>
  <div ref="editor" class="relative">
    <!-- Image -->
    <div
      class="handle size-20 flex justify-center items-center bg-black cursor-pointer"
      @click="showEditor = !showEditor"
    >
      <img :src="item.image" :alt="item.label" class="size-full border border-black object-cover" />
      <div class="absolute bottom-0 w-full bg-black/50 text-white text-center backdrop-blur-sm">
        {{ item.label }}
      </div>
    </div>
    <!-- Editor -->
    <ModalWrapper v-model="showEditor">
      <div class="grid gap-2">
        <img
          :src="item.image"
          :alt="item.label"
          class="size-32 mx-auto my-4 object-cover rounded-md"
        />
        <InputField type="file" @change="onFileChanged" />
        <InputField :value="item.label" @input="onLabelChanged" />
        <DeleteButton @click="onDelete">Delete</DeleteButton>
      </div>
    </ModalWrapper>
  </div>
</template>
