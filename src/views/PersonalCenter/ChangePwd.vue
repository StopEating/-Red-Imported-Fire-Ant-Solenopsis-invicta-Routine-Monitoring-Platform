<template>
    <div>
  <div style="margin-bottom:10px;">
    <el-page-header :icon="ArrowLeft"  @back="goBack">
      <template #content>
        <span>修改密码</span>
      </template>
    </el-page-header>
      </div>
      <el-card class="box-card">
        <el-form 
       :model="members" 
        class="demo-form-inline"
        label="right"
        label-width="100px"
        size="large"
     >
     <h3 style="margin-bottom:7%;text-align: center;">重置密码</h3>
      <el-form-item label="账号：" > 
        <el-input :value="phone" disabled/>
      </el-form-item>
      <el-form-item label="密码：" :rules="{
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          }" prop="pwd">
        <el-input v-model="members.pwd" placeholder="请输入新密码"  type="password"
      show-password/>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" @click="onSubmit" style="width:50%;margin:0 auto">保存修改</el-button>
      </el-form-item>
    </el-form>
    </el-card>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent,reactive,ref } from 'vue';
  import { ArrowLeft } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import axios from 'axios';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  export default defineComponent({
   setup(){
      const store=useStore()
      const router=useRouter()
      // 成员信息
  const members = reactive({
    phone: '',
    pwd:''
  })
  let phone=store.state.user.phone
  // 修改密码
  const onSubmit = () => {
    if(members.pwd==''){
      ElMessage({
      showClose: true,
      message: '密码不能为空！',
      type: 'error',
    })
    }
   else if(members.pwd!=''){
    axios.post('/antmonitor/unit/resetpwd?phone='+phone+'&newpwd='+members.pwd).then(res=>{
      if(res.data.status==200){
        ElMessage({
      showClose: true,
      message: '重置密码成功！',
      type: 'success',
    })
      members.pwd=''
    }else{
      members.pwd=''
      ElMessage({
      showClose: true,
      message: '保存修改失败！',
      type: 'error',
    })
    }
    })
    }
  }
  // 返回
  const goBack = () => {
    router.push('/index')
  }
  return {
  members,
  onSubmit,
  phone,
  ArrowLeft,
  goBack
      }
    },
  })
  </script>
  
  <style scoped>
  .box-card{
    width:500px;
    margin:10% auto
  }
  .el-form {
  width:90%
  }
  </style>
  