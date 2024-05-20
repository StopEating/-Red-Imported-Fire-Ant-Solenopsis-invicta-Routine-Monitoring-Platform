<template>
  <div style="position:relative;top:10px;left:0;">
    <template  v-if="showicon">
        <el-icon :size="40" class="icons" @click="icons" ><Expand /></el-icon>
    </template>
    <template v-if="showicon==false">
        <el-icon :size="40" class="icons"  @click="icons" ><Fold /></el-icon>
    </template>
  </div>
  <h1 style="margin-left:35px;margin-top: 15px;">
    红火蚁常态化监测云平台
  </h1>
  <el-dropdown class="user">
    <el-avatar> user </el-avatar>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>{{user}}</el-dropdown-item>
          <el-dropdown-item @click="alterpwd">修改密码</el-dropdown-item>
          <el-dropdown-item @click="logout"  divided>退出登录</el-dropdown-item>
        
        </el-dropdown-menu>
      </template>
    </el-dropdown>
</template>

<script lang="ts">
import { defineComponent,ref } from 'vue';
import { useStore } from 'vuex';
import emitter from '@/untils/bus';
import { useRouter } from 'vue-router';
export default defineComponent({
 setup(){
  const store=useStore()
  const router=useRouter()
  const user=store.state.user.username
    let show=ref(true)
    // 控制template的显示
    let showicon=ref(show)
    const icons=()=>{
        // 更改show的布尔值
       show=ref(!show.value)
        //与show的值进行同步
       showicon.value=show.value
        //向LeftMenu传送title的值
      const title = ref(show)
        // 点击图标 触发LeftMenu的方法
       emitter.emit('mittFn',title)
    }
    const logout=()=>{
      router.push({
          path: '/', //跳转的路径
        });
        store.dispatch('logouts','')//清除所有key
        // 退出后禁止返回上一页
    }
    const alterpwd=()=>{
      router.push('/personalcenter/changepwd')
    }
    return {
        icons,
        showicon,
        user,
        logout,
        alterpwd
    }
  },
})
</script>

<style scoped>
.icons{
    position:absolute;
    top:0;
    left:-4px;
    margin:0;
    padding:0;
}
.demo-type {
  display: flex;
}
.demo-type > div {
  flex: 1;
  text-align: center;
}
.demo-type > div:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}
.user{
  position: absolute;
  right:3%;
  top:6px;
  vertical-align: middle;
}

</style>
<style lang="less" scoped>
 
</style>
