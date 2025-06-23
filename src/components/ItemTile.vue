<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'

import InputField from './InputField.vue'
import ModalWrapper from './ModalWrapper.vue'

import type { Item } from '@/interfaces/tierlist'

const props = defineProps<{
  item: Item
}>()

// We emit our changes instead of assigning a v-model for draggable component compatibility
const emit = defineEmits(['update:label', 'update:image'])

const showEditor = ref(false)
const label = ref(props.item.label)
const image = ref(props.item.image)

// Close the editor when clicking outside of it
const target = useTemplateRef<HTMLElement>('editor')
onClickOutside(target, () => {
  if (showEditor.value) {
    showEditor.value = !showEditor.value
  }
})

// Handle input changes and emit the updated label
function onInput(event: Event) {
  const originalLabel = label.value

  emit('update:label', (event.target as HTMLInputElement).value)

  console.log(`Label for ${props.item.id} updated: ${originalLabel} => ${label.value}`)
}

// Handle image upload and emit the updated image
function onFileChanged(event: Event) {
  const target = event.target as HTMLInputElement
  if (target && target.files && target.files.length > 0) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      // Update image as base64 image data
      emit('update:image', reader.result as string)
      console.log(`Image for ${props.item.id} updated (base64)`)
    }
    reader.readAsDataURL(file)
  }
}

// Watch for changes in the item's label prop
watch(
  () => props.item.label,
  (val) => (label.value = val),
)
watch(
  () => props.item.image,
  (val) => (image.value = val),
)
</script>

<template>
  <div ref="editor" class="relative">
    <!-- Image -->
    <div
      class="handle size-20 flex justify-center items-center bg-black"
      @click="showEditor = !showEditor"
    >
      <img :src="item.image" :alt="item.label" class="size-full border border-black object-cover" />
      <div class="absolute bottom-0 w-full bg-black/50 text-white text-center backdrop-blur-sm">
        {{ item.label }}
      </div>
    </div>
    <!-- Editor -->
    <ModalWrapper v-model="showEditor">
      <div
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-96 p-4 grid gap-2 text-white bg-black border rounded-md shadow z-10 mt-2"
      >
        <img :src="image" :alt="label" class="size-32 mx-auto my-4 object-cover rounded-md" />
        <InputField type="file" @change="onFileChanged" />
        <InputField :value="label" @input="onInput" />
      </div>
    </ModalWrapper>
  </div>
</template>
