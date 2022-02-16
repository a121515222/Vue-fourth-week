
import paginations from "./pagination.js";
import modal from "./modal.js";

const app = Vue.createApp({
  data() {
    return {
      bsModal:'',  
      page:{},
      isNew: true,
      postId:"",
      user: {
        "username": "",
        "password": ""
      },
       apiInfo: {
        url: 'https://vue3-course-api.hexschool.io/v2',
        path: 'chun-chia'
      }, 
      products: [],
      productTemp: {},
      inputProduct: {
        title: "",
        category: "",
        origin_price: null,
        price: null,
        unit: "",
        description: "",
        content: "",
        is_enabled:"",
        imageUrl: "",
        imagesUrl:[],
      },
    }
  },
  components:{
    paginations,
    modal
  },
  methods: {
    closeModal() {
    this.bsModal.productModal.hide();
    //每次關閉都會重製inputProduct
    this.resetModal();
  },
  showProduct(data) {
    this.productTemp = data
  },
  receModalData(data){
    this.inputProduct=data
  }
  ,
  resetModal(){
    this.inputProduct = {
      title: "",
      category: "",
      origin_price: null,
      price: null,
      unit: "",
      description: "",
      content: "",
      is_enabled: "",
      imageUrl: "",
      imagesUrl: []
    };
  },
  
  editPorductList() {
    //新增商品
    if (this.isNew === true) {
     const sendData = this.sendDataPrepare();
      this.sendToken();
      axios.post(`${this.apiInfo.url}/api/${this.apiInfo.path}/admin/product`, sendData).then((res) => {
        alert(res.data.message);
        this.getProduct();
        this.resetModal();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    }
    //編輯商品
    else if (this.isNew === false) {
      const sendData = this.sendDataPrepare();
      this.sendToken();
      axios.put(`${this.apiInfo.url}/api/${this.apiInfo.path}/admin/product/${this.postId}`, sendData).then((res) => {
        alert(res.data.message);
        this.getProduct();
        this.closeModal();
        //清空postId
        this.postId="";
        
        
      }).catch((err) => {
        alert(err.response.data.message);
      });
    }
  },
  deleteProduct(){
    const confrim = prompt("請輸入delete")
    if(confrim==='delete'){
      axios.delete(`${this.apiInfo.url}/api/${this.apiInfo.path}/admin/product/${this.postId}`).then((res) => {
        alert(res.data.message);
        this.getProduct();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    }else{
      alert('輸入錯誤，不進行刪除')
    }
  },
  porductStatus(data) {
    let result = null;
    switch (data) {
      case 0: result = "未上架"
        break;
      case 1: result = "已上架"
        break;
      case 2: result = "缺貨中"
        break;
      case 3: result = "補貨中"
        break;
      case 4: result = "促銷中"
        break;
      case 5: result = "待下架"
        break;
    };
    return result;
  },
  sendDataPrepare(){
    const sendData = {
      data:
      {
        title: "",
        category: "",
        origin_price: null,
        price: null,
        unit: "",
        description: "",
        content: "",
        is_enabled: null,
        imageUrl: "",
        imagesUrl: []
      }
    };
    // this.inputProduct.is_enabled=parseInt(this.inputProduct.is_enabled);
    sendData.data=JSON.parse(JSON.stringify(this.inputProduct));
    return sendData;
  },
    login() {
      if (this.user.username !== '' && this.user.password !== '') {
        axios.post(`${this.apiInfo.url}/admin/signin`, this.user).then((res) => {
          //把token存到cookie
          document.cookie = `myHextoken1=${res.data.token}; expires=${new Date(res.data.expired)}`;
          //轉跳頁面到產品資料頁
          //或是用window.location="Vue first week-2.html"
          location.href = "./Admin productList.html"
        }).catch((err) => {
          
          alert(err.response.data.message)
        })
      } else { alert("請輸入帳號與密碼") }
    },
    openModal(data) {
      this.bsModal.productModal.show();
      //把id寫入postId
      //把products的資料取出傳到inputProudct
      if (this.isNew === false) {
        Object.keys(data).forEach((item)=>{
          Object.keys(this.inputProduct).forEach((i)=>{
            if(item===i){
              this.inputProduct[i]=data[item]
            };
          });
        });
        this.postId=data.id
      } else {
        return
       };
    },
    sendToken() {
      const myToken = document.cookie.replace(/(?:(?:^|.*;\s*)myHextoken1\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = myToken;
    },
    getProduct(page = 1) {
      //判斷目前頁面是否為"/Vue first week-2.html"可以先用console.log(location.pathname)確認
      //傳到git hub上面時要去看git hub上面的location.pathname，在網頁的console 輸入location.pathname
      if (location.pathname === '/Vue-fourth-week/Admin%20productList.html') {
        //取得所存在cookie的token
        this.sendToken();
        axios.get(`${this.apiInfo.url}/api/${this.apiInfo.path}/admin/products?page=${page}`).then((res) => {
          
          this.products = res.data.products;
          this.page = res.data.pagination
        }).catch((err) => {
          alert(`${err.response.data.message},自動轉跳至登入頁`)
          if(err.response.data.message==='驗證錯誤, 請重新登入'){
            location.href = "./index.html"
          }
        });
      }
    },
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    this.getProduct();
    this.bsModal =  new bootstrap.Modal(this.$refs.productModal)
  },
})
app.mount("#app")