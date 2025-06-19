<template>
  <LoadingOverlay :active="isLoading" />

  <!-- 頁面標題區域 -->
  <PageHeader
    icon="fas fa-shopping-cart"
    icon-color="text-primary"
    title="訂單管理"
    subtitle="管理所有客戶訂單與付款狀態"
  />

  <!-- 統計卡片 -->
  <div class="row mb-4">
    <div class="col-md-3 mb-3">
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="flex-grow-1">
              <p class="text-muted mb-1 small">總訂單數</p>
              <h4 class="mb-0 fw-bold">{{ orderStats.total }}</h4>
            </div>
            <div class="text-primary">
              <i class="fas fa-list-alt fa-2x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="flex-grow-1">
              <p class="text-muted mb-1 small">已付款</p>
              <h4 class="mb-0 fw-bold text-success">{{ orderStats.paid }}</h4>
            </div>
            <div class="text-success">
              <i class="fas fa-check-circle fa-2x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="flex-grow-1">
              <p class="text-muted mb-1 small">未付款</p>
              <h4 class="mb-0 fw-bold text-warning">{{ orderStats.unpaid }}</h4>
            </div>
            <div class="text-warning">
              <i class="fas fa-clock fa-2x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="flex-grow-1">
              <p class="text-muted mb-1 small">總金額</p>
              <h4 class="mb-0 fw-bold text-info">
                NT$ {{ orderStats.totalAmount.toLocaleString() }}
              </h4>
            </div>
            <div class="text-info">
              <i class="fas fa-dollar-sign fa-2x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 搜尋和篩選區域 -->
  <div class="card border-0 shadow-sm mb-4">
    <div class="card-body">
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label small text-muted">搜尋訂單</label>
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0">
              <i class="fas fa-search text-muted"></i>
            </span>
            <input
              type="text"
              class="form-control border-start-0"
              placeholder="搜尋 Email 或訂單編號..."
              v-model="searchQuery"
            />
          </div>
        </div>
        <div class="col-md-3">
          <label class="form-label small text-muted">付款狀態</label>
          <select class="form-select" v-model="paymentFilter">
            <option value="">全部狀態</option>
            <option value="paid">已付款</option>
            <option value="unpaid">未付款</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label small text-muted">日期篩選</label>
          <input type="date" class="form-control" v-model="dateFilter" />
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100" @click="clearFilters">
            <i class="fas fa-refresh me-1"></i>
            清除
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 訂單列表 -->
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white border-bottom">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-semibold">訂單列表</h5>
        <span class="badge bg-light text-dark"
          >共 {{ filteredOrders.length }} 筆訂單</span
        >
      </div>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th class="border-0 ps-4">日期</th>
              <th class="border-0">客戶信箱</th>
              <th class="border-0">訂單編號</th>
              <th class="border-0">總金額</th>
              <th class="border-0">付款狀態</th>
              <th class="border-0">備註</th>
              <th class="border-0 pe-4">操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in filteredOrders" :key="item.id">
              <tr class="border-bottom">
                <td class="ps-4">
                  <div class="text-dark fw-medium">
                    {{ formatDate(item.create_at) }}
                  </div>
                  <small
                    class="text-muted"
                    >{{ formatTime(item.create_at) }}</small
                  >
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div
                      class="avatar-sm rounded-circle bg-primary bg-opacity-10 me-2 d-flex align-items-center justify-content-center"
                    >
                      <i class="fas fa-user text-primary"></i>
                    </div>
                    <div>
                      <div class="text-dark">{{ item.user.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <code
                    class="bg-light text-dark px-2 py-1 rounded small"
                    >{{ item.id }}</code
                  >
                </td>
                <td>
                  <span class="fw-semibold text-success"
                    >NT$
                    {{ calculateCorrectTotal(item).toLocaleString() }}</span
                  >
                </td>
                <td>
                  <span
                    :class="item.is_paid ? 'badge bg-success' : 'badge bg-warning text-dark'"
                  >
                    <i
                      :class="item.is_paid ? 'fas fa-check me-1' : 'fas fa-clock me-1'"
                    ></i>
                    {{ item.is_paid ? '已付款' : '未付款' }}
                  </span>
                </td>
                <td>
                  <span
                    class="text-muted small"
                    >{{ item.message || '-' }}</span
                  >
                </td>
                <td class="pe-4">
                  <div class="btn-group">
                    <button
                      class="btn btn-outline-primary btn-sm"
                      type="button"
                      @click="openModal(item)"
                      title="檢視詳細"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      :class="item.is_paid ? 'btn btn-outline-warning btn-sm' : 'btn btn-outline-success btn-sm'"
                      type="button"
                      @click="togglePaymentStatus(item)"
                      :title="item.is_paid ? '標記為未付款' : '標記為已付款'"
                    >
                      <i
                        :class="item.is_paid ? 'fas fa-times' : 'fas fa-check'"
                      ></i>
                    </button>
                    <button
                      class="btn btn-outline-danger btn-sm"
                      type="button"
                      @click="openDelModal(item)"
                      title="刪除訂單"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- 空狀態 -->
        <div v-if="filteredOrders.length === 0" class="text-center py-5">
          <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">沒有找到符合條件的訂單</h5>
          <p class="text-muted">請調整搜尋條件或清除篩選器</p>
        </div>
      </div>
    </div>
  </div>

  <OrderModal ref="orderModal" :order="tempOrder" @update-paid="updatePaid" />
  <DelModal ref="delModal" :item="tempOrder" @del-item="deleteOrder" />
</template>

<script setup>
import {
  ref, reactive, computed, onMounted,
} from 'vue';
import axios from 'axios';
import useToastMessageStore from '@/stores/toastMessage';
import PageHeader from '@/components/PageHeader.vue';
import OrderModal from '@/components/OrderModal.vue';
import DelModal from '@/components/DelModal.vue';

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

const toastMessageStore = useToastMessageStore();
const { addMessage } = toastMessageStore;

const orders = ref({});
const isLoading = ref(true);
const tempOrder = reactive({});
const searchQuery = ref('');
const paymentFilter = ref('');
const dateFilter = ref('');

const orderModal = ref(null);
const delModal = ref(null);

// Helper Functions
function calculateCorrectTotal(order) {
  return order.total || 0;
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Computed Properties
const ordersArray = computed(() => Object.values(orders.value || {}));

const filteredOrders = computed(() => {
  let filtered = ordersArray.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (order) => order.user.email.toLowerCase().includes(query)
        || order.id.toLowerCase().includes(query),
    );
  }

  if (paymentFilter.value === 'paid') {
    filtered = filtered.filter((order) => order.is_paid);
  } else if (paymentFilter.value === 'unpaid') {
    filtered = filtered.filter((order) => !order.is_paid);
  }

  if (dateFilter.value) {
    const filterDate = new Date(dateFilter.value);
    filtered = filtered.filter((order) => {
      const orderDate = new Date(order.create_at * 1000);
      return orderDate.toDateString() === filterDate.toDateString();
    });
  }

  return filtered;
});

const orderStats = computed(() => {
  const allOrders = ordersArray.value;
  const total = allOrders.length;
  const paid = allOrders.filter((order) => order.is_paid).length;
  const unpaid = total - paid;
  const totalAmount = allOrders.reduce(
    (sum, order) => sum + calculateCorrectTotal(order),
    0,
  );

  return {
    total,
    paid,
    unpaid,
    totalAmount,
  };
});

// Component Methods
function getOrders(page = 1) {
  isLoading.value = true;
  axios
    .get(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/orders?page=${page}`)
    .then((res) => {
      orders.value = res.data.orders;
      isLoading.value = false;
    })
    .catch((err) => {
      isLoading.value = false;
      addMessage({
        title: '取得訂單失敗',
        content: err.response.data.message,
        style: 'danger',
      });
    });
}

function openModal(item) {
  Object.assign(tempOrder, item);
  orderModal.value.openModal();
}

function openDelModal(item) {
  Object.assign(tempOrder, item);
  delModal.value.openModal();
}

function updatePaid(item) {
  isLoading.value = true;
  const paidStatus = { is_paid: item.is_paid };
  axios
    .put(
      `${VITE_API_URL}/api/${VITE_API_PATH}/admin/order/${item.id}`,
      { data: paidStatus },
    )
    .then((res) => {
      isLoading.value = false;
      orderModal.value.closeModal();
      getOrders();
      addMessage({
        title: '更新付款狀態成功',
        content: res.data.message,
        style: 'success',
      });
    })
    .catch((err) => {
      isLoading.value = false;
      addMessage({
        title: '更新付款狀態失敗',
        content: err.response.data.message,
        style: 'danger',
      });
    });
}

function togglePaymentStatus(item) {
  const updatedOrder = { ...item, is_paid: !item.is_paid };
  updatePaid(updatedOrder);
}

function deleteOrder() {
  isLoading.value = true;
  axios
    .delete(
      `${VITE_API_URL}/api/${VITE_API_PATH}/admin/order/${tempOrder.id}`,
    )
    .then((res) => {
      isLoading.value = false;
      delModal.value.closeModal();
      getOrders();
      addMessage({
        title: '刪除訂單成功',
        content: res.data.message,
        style: 'success',
      });
    })
    .catch((err) => {
      isLoading.value = false;
      addMessage({
        title: '刪除訂單失敗',
        content: err.response.data.message,
        style: 'danger',
      });
    });
}

function clearFilters() {
  searchQuery.value = '';
  paymentFilter.value = '';
  dateFilter.value = '';
}

// Lifecycle Hooks
onMounted(() => {
  getOrders();
});
</script>

<style scoped>
.avatar-sm {
  width: 2rem;
  height: 2rem;
}

.table > :not(caption) > * > * {
  padding: 1rem 0.75rem;
}

.table tbody tr:hover {
  background-color: rgba(var(--bs-primary-rgb), 0.03);
}

.card {
  transition: all 0.2s ease-in-out;
}

.badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}

.btn-group .btn {
  transition: all 0.2s ease-in-out;
}

.btn-group .btn:hover {
  transform: translateY(-1px);
}

/* 搜尋輸入框樣式 */
.input-group .form-control:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

.input-group-text {
  background-color: var(--bs-gray-100);
  border-color: var(--bs-border-color);
}

/* 空狀態樣式 */
.text-center i {
  opacity: 0.5;
}
</style>
