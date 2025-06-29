<script setup lang="ts">
// Import necessary libraries and components
import { ref, defineAsyncComponent, onMounted, onUnmounted } from 'vue'

import ItemRow from '@/components/ItemRow.vue'
import TierRow from '@/components/TierRow.vue'
import { templates } from '@/data/templates'

import type { Item, Tier, TierList } from '@/interfaces/tierlist'
import InputField from '@/components/InputField.vue'

// Seed 20 items for the item dock
const itemSeed = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  label: `Item ${i + 1}`,
  image: `https://placecats.com/30${i}/20${i}`,
}))

// Initialize the data
const currentId = ref(0)
const data = ref<TierList[]>([
  {
    id: 0,
    name: 'Tier List 1',
    description: 'Sample tier list for demonstration',
    itemDock: itemSeed,
    tiers: templates[1].tiers ?? [],
  },
])

// Dynamically import draggable component for performance
const draggable = defineAsyncComponent(() => import('vuedraggable'))
const drag = ref(false)

// Add a new tier to the current tier list
function addTier() {
  const newTier: Tier = {
    id: data.value[currentId.value].tiers.length + 1,
    label: 'New Tier',
    colorHex: '#fff',
    items: [],
  }
  data.value[currentId.value].tiers.push(newTier)
  console.log(`Added new tier: ${newTier.label}`)
  console.log(`Current tiers:`, data.value[currentId.value].tiers)
}

// Upload image from clipboard and create a new item
async function handlePaste() {
  try {
    // Read from the clipboard
    console.log('Reading from clipboard...')
    const clipboardContents = await navigator.clipboard.read()
    for (const item of clipboardContents) {
      // Check if the item contains image data
      const supportedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      const imageType = supportedTypes.find((type) => item.types.includes(type))
      if (!imageType) {
        throw new Error('Clipboard does not contain a supported image format')
      }

      // Get the first image item
      const blob = await item.getType('image/png')
      const reader = new FileReader()
      reader.onload = () => {
        // Create new item with base64 image data
        createItem('', reader.result as string)
      }
      reader.readAsDataURL(blob)
      return
    }
  } catch (exception) {
    console.error('Failed to paste from clipboard:', exception)
  }
}

// Create a new item in the item dock
function createItem(label: string, image: string) {
  // Initialise a new item
  const newItem: Item = {
    id: data.value[currentId.value].itemDock.length + 1,
    label: label,
    image: image,
  }

  // Push it to the item dock
  data.value[currentId.value].itemDock.push(newItem)

  // Log the new item
  console.log(`Created new item: ${newItem.id}`)
  console.log(`Current item dock:`, data.value[currentId.value].itemDock)
}

// Export the current tier list to an image
async function exportToImage() {
  // Dynamically import html2canvas to only load it when needed
  console.log('Importing canvas library...')
  const { default: html2canvas } = await import('html2canvas-pro')

  // Render the selected area to a canvas
  console.log('Rendering capture area...')
  html2canvas(document.querySelector('#capture') as HTMLElement, {
    windowWidth: 1152,
    useCORS: true, // Temporary measure to allow cross-origin images
  }).then((canvas) => {
    // Download the canvas as an image
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'tierlist.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    console.log('Image rendered')
  })
}

// Export the current tier list data to a JSON file
function exportToJson() {
  // Convert the data to JSON
  const jsonData = JSON.stringify(data.value, null, 2)

  // Create a Blob from the JSON data
  const blob = new Blob([jsonData], { type: 'application/json' })

  // Create a link element to download the Blob
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'tierlist.json'

  // Append the link to the body and trigger a click to download
  document.body.appendChild(link)
  link.click()

  // Clean up by removing the link
  document.body.removeChild(link)
  console.log('Exported to JSON:', jsonData)
}

// Import a tier list and overwrite the current data
function importFromJson(event: Event) {
  // Check if the event is a file input change
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // Parse the JSON data
        const jsonData = JSON.parse(e.target?.result as string)
        // Update the data with the parsed JSON
        data.value = jsonData
        console.log('Imported from JSON:', jsonData)
      } catch (exception) {
        console.error('Error parsing JSON:', exception)
      }
    }
    reader.readAsText(file)
  } else {
    console.warn('No file selected for import')
  }
}

// Handle name change in the input field
function onNameChanged(event: Event) {
  const target = event.target as HTMLInputElement
  if (target) {
    // Update the name of the current tier list
    data.value[currentId.value].name = target.value
    console.log(`Tier list name updated to "${target.value}"`)
  }
}

// Lifecycle hooks
onMounted(() => {
  console.log('App mounted')
  console.log('Listening for paste event')
  window.addEventListener('paste', handlePaste)
})
onUnmounted(() => {
  console.log('Removing paste event listener')
  window.removeEventListener('paste', handlePaste)
})
</script>

<template>
  <main class="w-11/12 max-w-6xl m-auto">
    <InputField :value="data[currentId].name" @input="onNameChanged" />
    <!-- Draggable tiers -->
    <div id="capture">
      <draggable
        v-model="data[currentId].tiers"
        group="tiers"
        @start="drag = true"
        @end="drag = false"
        item-key="id"
        handle=".handle"
        class="flex flex-col"
      >
        <template #item="{ element }">
          <TierRow :tier="element" />
        </template>
      </draggable>
    </div>
    <button class="border p-2" @click="addTier">New Tier</button>
    <!-- Item dock -->
    <ItemRow v-model="data[currentId].itemDock" :draggable="drag" />
    <button class="border p-2" @click="createItem('', '')">Add Item</button>
    <button class="border p-2" @click="exportToImage">Export to image</button>
    <label for="import-json" class="border p-2 cursor-pointer inline-block">Import</label>
    <input
      type="file"
      id="import-json"
      class="hidden border p-2"
      @change="importFromJson"
      accept=".json"
    />
    <button class="border p-2" @click="exportToJson">Export</button>
  </main>
</template>
