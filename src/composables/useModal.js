import { ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';

export default function useModal(modalRef) {
  const modal = ref(null);

  onMounted(() => {
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value, {
        backdrop: 'static',
        keyboard: false,
      });
    }
  });

  onUnmounted(() => {
    modal.value?.dispose();
  });

  const openModal = () => {
    modal.value?.show();
  };

  const closeModal = () => {
    modal.value?.hide();
  };

  return {
    openModal,
    closeModal,
    modal,
  };
}
