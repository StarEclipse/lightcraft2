<template>
  <div
    id="delProductModal"
    ref="delProductModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="delProductModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger">{{tempProduct.title}}</strong>
          商品(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="deleteProduct">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import axios from 'axios';
import useModal from '@/composables/useModal';
import useToastMessageStore from '@/stores/toastMessage';

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

const props = defineProps({
  tempProduct: Object,
});

const emit = defineEmits(['update']);

const modal = ref(null);
const { openModal, closeModal } = useModal(modal);
defineExpose({ openModal, closeModal });

const { addMessage } = useToastMessageStore();

function deleteProduct() {
  axios
    .delete(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/product/${props.tempProduct.id}`)
    .then((res) => {
      addMessage({
        title: '成功刪除產品',
        content: res.data.message,
        style: 'success',
      });
      closeModal();
      emit('update');
    })
    .catch((err) => {
      addMessage({
        title: '刪除產品失敗',
        content: err.response.data.message,
        style: 'danger',
      });
    });
}
</script>
