import { ref } from 'vue'

export function useImageUpload() {
  const imageUrl = ref<string | null>(null)

  function onFileChanged(event: Event, onImageLoaded?: (dataUrl: string) => void) {
    const target = event.target as HTMLInputElement
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        imageUrl.value = reader.result as string
        if (onImageLoaded) onImageLoaded(imageUrl.value)
      }
      reader.readAsDataURL(file)
    }
  }

  return { imageUrl, handleFileChange }
}
