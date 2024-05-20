<template>
 <div class="common-layout">
    <el-container>
      <el-aside :class="showclass"><LeftNavVue @handleSubmit="submitData"></LeftNavVue></el-aside>
      <el-container>
        <el-header><TopBar></TopBar></el-header>
        <el-main>
          <!-- element-plus汉化 -->
          <el-config-provider :locale="locale">
            <router-view></router-view>
          </el-config-provider></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent,ref,watch,inject } from 'vue';
import { ElConfigProvider } from 'element-plus'
import { ElMessage } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import LeftNavVue from '../components/LeftNav.vue';
import TopBar from '@/components/TopBar.vue';
import { useStore } from 'vuex';
import router from '@/router';

const locale=zhCn
const reload = inject<any>("reload");
const store=useStore()
if(store.state.user.needsetpwd==true){
  ElMessage({
          showClose: true,
          message: `请修改登陆密码`,
          type: 'warning',
        })
        router.push('/personalcenter/changepwd')
}
    if(store.state.user.username==''){
      router.push('/')
    }
    let showclass=ref('asideshow')
    // 获取子组件传来的值
    const submitData=(title:any)=>{
      let ifshow=title.value
      if(ifshow){
        showclass.value='asideshow'
      }else{
       showclass.value='aside'
      }
      }
     

</script>

<style scoped lang="less">
  *{
    margin:0;
    padding:0;
  }
.common-layout{
  width:100%;
  height: 100%;
}
.el-header{
  display: flex;
  border-bottom: 1px solid #ccc;
}
.el-container{
  width:100%;
  height:100%
}
.el-aside{
  width:auto
}
.asideshow {
  width: 200px !important;
  height: 100%;
  margin: 0px;
  padding:0;
}
.el-main{
  margin:0;
  padding:0
}
</style>
