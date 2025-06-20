<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'

import InputField from './InputField.vue'

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
    showEditor.value = false
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
    // Represent the image as a file,
    const blob = target.files[0]

    // Use URL or webkitURL to create a source
    const urlObj = window.URL || window.webkitURL
    emit('update:image', urlObj.createObjectURL(blob as Blob))

    console.log(`Image for ${props.item.id} updated`)
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
  <div>
    <!-- Image -->
    <div
      class="handle flex justify-center items-center size-16 border"
      @click="showEditor = !showEditor"
    >
      <img :src="item.image" :alt="item.label" class="size-12 object-cover" />
    </div>
    <!-- Editor -->
    <div
      ref="editor"
      @click="showEditor = true"
      :class="showEditor ? 'absolute' : 'hidden'"
      class="max-w-full p-4 grid gap-2 text-white bg-black border rounded-md shadow z-10"
    >
      <!-- On image upload -->
      <InputField type="file" @change="onFileChanged" />
      <InputField :value="label" @input="onInput" />
    </div>
  </div>
</template>
