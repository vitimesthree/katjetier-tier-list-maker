<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'

const show = defineModel()

// When clicked outside the modal
const target = useTemplateRef<HTMLElement>('modal')
onClickOutside(target, () => {
  closeModal()
})

// When the following keys are pressed
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && show.value) {
    closeModal()
  }
}

// Close the modal
function closeModal() {
  if (show.value) {
    show.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div v-if="show" class="w-screen h-screen fixed top-0 left-0 bg-black/50 z-20">
    <div ref="modal">
      <slot />
    </div>
  </div>
</template>
