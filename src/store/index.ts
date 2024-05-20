import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"

export default createStore({
  state: {
    user:{
      id:'',
      phone:'',
      type:'',
      username:''
    }
  },
  getters: {
  },
  mutations: {
    setuser(state,payload){
      state.user=payload
      // localStorage.setItem('user',state.user as any)
    },
    // 登录
//   login(state, user) {
//     state.user = user;
//     localStorage.setItem("userInfo", user);
// },
// 退出
logout(state, user) {
  history.pushState(null, '', document.URL)

    state.user = {
      id:'',
      phone:'',
      type:'',
      username:''
    };
}
  },
  actions: {
    // 获取数据，将数据传递到mutations进行修改
    getuser(context,info){
      context.commit('setuser',info)
    },
    logouts(context,info){
      context.commit('logout',info)
    }
  },
  modules: {
  },
  plugins: [createPersistedState({
    key: 'vuex', // 存储是的名字
 
    // 也可以是sessionstorage
    storage: window.localStorage
  })]
})

