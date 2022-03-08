let productModal = {};
let deleteProduct = {};
// 建立Vue環境
const app = {
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "yu-hexschool",
      products: [],
      tempProduct: {
        //多圖資料
        imageUrl: [],
      },
      isNew: false,
    };
  },
  methods: {
    // 確認使用者身份，身份正確則登入，身份錯誤則導回登入頁面
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios
        .post(url)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = "index.html";
        });
    },
    getProducts() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
          console.log(Object.values(this.products));
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    // 新增和編輯共用modal,帶入狀態和產品
    openModal(status, product) {
      console.log(status, product);
      if (status === "isNew") {
        this.tempProduct = {
          imageUrl: [],
        };
        productModal.show();
        this.isNew = true;
      } else if (status === "edit") {
        // 淺拷貝,避免編輯到一半退出後改到原本的資料
        //如果外層顯示到深層的圖片,可能就得改用深層拷貝
        this.tempProduct = { ...product };
        productModal.show();
        this.isNew = false;
      } else if ((status = "delete")) {
        delProductModal.show();
        this.tempProduct = { ...product };
      }
    },
    updateProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let method = "post";
      // 使用isNew狀態來判斷當前指令是編輯還是新增商品,取用不同的api組合
      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        method = "put";
      }
      axios[method](url, { data: this.tempProduct })
        .then((res) => {
          console.log(res);
          this.getProducts();
          productModal.hide();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then((res) => {
          console.log(res);
          this.getProducts();
          delProductModal.hide();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },

  mounted() {
    // 讀取token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // 將token寫入axios預設設定
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();

    productModal = new bootstrap.Modal(
      document.getElementById("productModal"),
      {
        keyboard: true,
      }
    );
    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal"),
      {
        keyboard: true,
      }
    );
  },
};
Vue.createApp(app).mount("#app");
