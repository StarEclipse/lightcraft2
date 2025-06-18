<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="staticBackdrop"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog">
      <div class="modal-content ">
        <div class="modal-header bg-dark text-white">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">編輯優惠券</h1>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="coupon-name" class="col-form-label">名稱</label>
              <input
                type="text"
                class="form-control"
                id="coupon-name"
                v-model="tempCoupon.title"
                placeholder="請輸入標題"
              />
            </div>
            <div class="mb-3">
              <label for="coupon-number" class="col-form-label">優惠碼</label>
              <input
                type="text"
                class="form-control"
                id="coupon-number"
                v-model="tempCoupon.code"
                placeholder="請輸入優惠碼"
              />
            </div>
            <div class="mb-3">
              <label for="coupon-date" class="col-form-label">到期日</label>
              <input
                type="date"
                class="form-control"
                id="coupon-date"
                v-model="due_date"
              />
            </div>
            <div class="mb-3">
              <label for="coupon-price" class="col-form-label"
                >折扣百分比</label
              >
              <input
                type="number"
                class="form-control"
                id="coupon-price"
                min="0"
                v-model.number="tempCoupon.percent"
              />
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="is-enabled"
                  min="0"
                  :true-value="1"
                  :false-value="0"
                  v-model="tempCoupon.is_enabled"
                />
                <label for="is-enabled" class="form-check-label"
                  >是否啟用</label
                >
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            關閉
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('update-coupon', tempCoupon)"
          >
            {{ isNew ? '新增優惠券' : '更新優惠券' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import useModal from '@/composables/useModal';

const props = defineProps({
  coupon: Object,
  isNew: Boolean,
});

defineEmits(['update-coupon']);

const modalRef = ref(null);
const { openModal, closeModal } = useModal(modalRef);

const tempCoupon = ref({});
const dueDate = ref('');

watch(dueDate, () => {
  tempCoupon.value.due_date = Math.floor(new Date(dueDate.value) / 1000);
});

watch(
  () => props.coupon,
  (val) => {
    tempCoupon.value = val;
    const dateAndTime = new Date(val.due_date * 1000).toISOString().split('T');
    [dueDate.value] = dateAndTime;
  },
  { immediate: true },
);

defineExpose({ openModal, closeModal });
</script>
