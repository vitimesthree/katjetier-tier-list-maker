<script setup lang="ts">
import { ref, watch } from 'vue'

import type { Item } from '@/interfaces/tierlist'

const props = defineProps<{
  item: Item
}>()
// We emit our changes instead of assigning a v-model for draggable component compatibility
const emit = defineEmits([
  'update:label',
  'update:image'
])

const label = ref(props.item.label)
const image = ref(props.item.image)

// Handle input changes and emit the updated label
function onInput(event: Event) {
  const originalLabel = label.value

  emit('update:label', (event.target as HTMLInputElement).value)

  console.log(`Label for ${props.item.id} updated: ${originalLabel} => ${label.value}`)
}

// Handle image upload and emit the updated image
function onFileChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      // Represent the image as a file,
      const blob = target.files[0];

      // Use URL or webkitURL to create a source
      const urlObj = window.URL || window.webkitURL;
      emit('update:image', urlObj.createObjectURL(blob as Blob))

      console.log(`Image for ${props.item.id} updated`);
    }
}

// Watch for changes in the item's label prop
watch(() => props.item.label, (val) => label.value = val)
watch(() => props.item.image, (val) => image.value = val)
</script>

<template>
  <div>
    <!-- Image -->
    <div class="handle flex justify-center items-center size-16 border">
      <img :src="item.image" :alt="item.label" class="size-12 object-cover" />
    </div>
    <!-- Editor -->
    <div class="absolute z-10">
      <div class="text-white bg-black border p-2">
        <!-- on image upload -->
        <input
          type="file"
          @change="onFileChanged">
        <input :value="label" @input="onInput" />
      </div>
    </div>
  </div>
</template>
