<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login">
    <!-- 卡片样式 -->
          
    <el-card shadow="always" class="demo-ruleForm login-container"> 

      <!-- 登录表单 -->
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="0px"
          class="demo-ruleForm"
        >
        <h3 class="title">用户登录</h3>
        
      <!-- 账号 -->
    <el-form-item prop="name" >
      <el-input v-model="ruleForm.name" placeholder="账号"/>
    </el-form-item>

     <!-- 密码框 -->
    <el-form-item  prop="pass">
      <el-input v-model="ruleForm.pass" placeholder="密码" type="password" autocomplete="off" />
    </el-form-item>

    <!-- 记住密码 -->
    <el-form-item style="text-align: right">
              <el-checkbox v-model="isRemember">
               记住密码
              </el-checkbox>
          </el-form-item>

    <!-- 登录重置按钮 -->
    <el-form-item style="width:100%;">
   
       <el-button type="primary" @click="submitForm(ruleFormRef)" style="width:100%;">
        登录</el-button>
    </el-form-item>

  </el-form>

    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent,onMounted } from 'vue';
import { reactive, ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
// 引入路由
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default defineComponent({
  setup(){
    const store=useStore()
    const router = useRouter();
    console.log(store.state.user)
const isRemember=ref(false)
  // 设置表单验证
  const ruleFormRef = ref<FormInstance>()

  // 校验账号
  const checkAge = (rule: any, value: any, callback: any) => {
    if(value == "" || value == null){
      return callback(new Error('请输入账号'))
  }
  var telreg = /^(((1[0-9]{1}[0-9]{1}))+\d{8})$/;
  if(!telreg.test(value) || value.length != 11){
    return callback(new Error('账号格式不正确'))
  }else{
    return true
  }
  }
  // 校验密码
  const validatePass = (rule: any, value: any, callback: any) => {
    if(value == "" || value == null){
      return callback(new Error('请输入密码'))
  }
    // if (value!==ruleForm.name) {
    //   return callback(new Error('密码错误'))
    // }
    else{
    return true
  }
  }
  // 设置响应式数据
  const ruleForm = reactive({
    pass: '',
    name: '',
  })

  const rules = reactive({
    pass: [{ validator: validatePass, trigger: 'blur' }],
    name: [{ validator: checkAge, trigger: 'blur' }],
  })

  // 点击登录
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        axios.post('/antmonitor/unit/login?phone='+ruleForm.name+'&passwd='+ruleForm.pass).then(res=>{
          console.log(res)
         if(res.data.status==200){
          if(isRemember.value == true){
       setCookie(ruleForm.name,ruleForm.pass,7)
        }else{
          clearCookie();
        }
          // 设置vuex
        store.dispatch('getuser',res.data.data)
          router.push('/index')
         }else{
          ElMessage({
          showClose: true,
          message: `${res.data.msg}`,
          type: 'error',
        })
         }
        })
        // 路由跳转
      } else {
        ElMessage({
          showClose: true,
          message: `登录失败！`,
          type: 'error',
        })
        return false
      }
    })
  }

  // 记住密码
    const getCookie=()=>{
      console.log(document.cookie)
        if(document.cookie.length>0){
          var arr = document.cookie.split(";"); 
          for(var i = 0;i<arr.length; i++){
            var userKey = arr[i].split("=");
            if(userKey[0].trim() == "userName"){
              ruleForm.name = userKey[1];
            }else if(userKey[0].trim() == "userPws"){
              ruleForm.pass= userKey[1];
            }else if(userKey[0].trim() == "isRemember"){
              isRemember.value = Boolean(userKey[1]); 
            }
          }
        }
      }
      //存储
    const setCookie=(userName:any,userPws:any,days:any)=>{
        var curDate = new Date();
            curDate.setTime(curDate.getTime() + 24*60*60*1000*days);  //设置cookie存储的有效时间
            window.document.cookie = "userName" + "=" + userName + ";path=/;expires=" + curDate.toUTCString();
            window.document.cookie = "userPws" + "=" + userPws + ";path=/;expires=" + curDate.toUTCString();
            window.document.cookie = "isRemember" + "=" +isRemember.value + ";path=/;expires=" + curDate.toUTCString();
      }
      //如果用户不选择记住密码清除cookie
     const clearCookie=()=>{
       setCookie("","",-1);
      }
 onMounted(()=>{
  getCookie()
 })
  
  // 返回
  return{
      ruleFormRef,
      ruleForm,
      rules,
      submitForm,
      isRemember,
      getCookie,
      setCookie,
      clearCookie
    }
   }
});

</script>

<style lang="less" scoped>

</style>
<style scoped>
  .login {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 10%;
  background-color: #112346;
  /* background-repeat: no-repeat; */
  background-position: center right;
  background-size: 100%;
}
.login-container {
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  /* background: #fff; */
  border: 1px solid #eaeaea;
  color: white;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: rgb(31, 27, 27);;
}
</style>
