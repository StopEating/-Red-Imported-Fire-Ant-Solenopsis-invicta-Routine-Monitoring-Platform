<template>
    <div class="select">
        防控区：<el-select v-model="fkarea" class="m-2" placeholder="防控区" style="width:200px" @change="getyqareas">
    <el-option
      v-for="item in fkareas"
      :key="(item as any).aid"
      :label="(item as any).aname"
      :value="(item as any).aid"
    />
  </el-select>
  <!-- 样区更换更新边界 -->
      样区：<el-select v-model="yarea" class="m-2" placeholder="请选择样区" style="width:200px" @change="getboarddata">
    <el-option
      v-for="item in yareas"
      :key="(item as any).pid"
      :label="(item as any).pdname"
      :value="(item as any).pid"
    />
  </el-select>
    </div>
  <div style="display:flex;flex-direction: row;">
   <div style="flex:1">
     <div style="padding-left:3%;line-height: 2em;">
        <div style="justify-content: space-between;">
    <span>样区名称：{{ (datas as any).pdname }}</span>  
    <span style="padding-left:4em">
        面积：{{  (datas as any).carea }}亩
    </span>
        </div>
    防控周期：{{ (datas as any).stdate  }}至{{ (datas as any).eddate  }}
     </div>
    <el-card class="box-card" >
        <div class="text item">
        <el-form>
        <el-form-item label="防控人次:">
            {{ (datas as any).mennum }}
    </el-form-item>
    <el-form-item label="区域撒播:">
            {{ (datas as any).qysb }}
    </el-form-item>
    <el-form-item label="药品用量:">
            {{ (datas as any).qpsnum }}克/亩
    </el-form-item>
    <el-form-item label="蚁巢环施:">
            {{ (datas as any).ychs }}
    </el-form-item>
    <el-form-item label="药品用量:">
            {{ (datas as any).hpsnum }}克/蚁巢
    </el-form-item>
        <el-form-item>
            防控成效：
        </el-form-item>
    <el-form-item label="平均工蚁头数退减率:">
            {{ (datas as any).antdesc }}
    </el-form-item>
    <el-form-item label="活蚁巢退减率:">
            {{ (datas as any).nestdesc }}
    </el-form-item>

    </el-form>
</div>
  </el-card> 
   </div>
   <div style="flex:1">
    <div style="line-height: 4em;">
        防控前数据：
    </div>
    <el-card class="box-card" >

<div class="text item">
    <el-form>
    <el-form-item label="监测周期:">
        {{ (before as any).stdate }}-{{(before as any).eddate  }}
</el-form-item>
<el-form-item label="诱集点数:">
        {{ (before as any).dvnum }}
</el-form-item>
<el-form-item label="平均诱集工蚁头数:">
        {{ (before as any).aantnum }}头/诱集点<br/>
        {{ (before as any).bantnum }}头/亩
</el-form-item>
<el-form-item label="活蚁巢数:">
        {{ (before as any).ycnum }}
</el-form-item>
<el-form-item label="平均蚁巢密度:">
        {{ (before as any).ycdst }}个/亩
</el-form-item>
<el-form-item label="蚁情等级:">
        {{ (before as any).grade }}
</el-form-item>
</el-form>
</div>
</el-card> 
   </div>
    <div style="flex:1">
    <div style="line-height: 4em;">
        防控后数据：
    </div>
    <el-card class="box-card" >
    <div class="text item">     
        <el-form>
        <el-form-item label="监测周期:">
            {{ (after as any).stdate }}-{{(after as any).eddate  }}
    </el-form-item>
    <el-form-item label="诱集点数:">
            {{ (after as any).dvnum }}
    </el-form-item>
    <el-form-item label="平均诱集工蚁头数:">
    {{ (after as any).aantnum }}头/诱集点
        <br/>
    {{ (after as any).bantnum }}头/亩

    </el-form-item>
    <el-form-item label="活蚁巢数:">
            {{ (after as any).ycnum }}
    </el-form-item>
    <el-form-item label="平均蚁巢密度:">
            {{ (after as any).ycdst }}个/亩
    </el-form-item>
    <el-form-item label="蚁情等级:">
            {{ (after as any).grade }}
    </el-form-item>
    </el-form></div>
  </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import axios from 'axios'
  import {useRouter} from 'vue-router'
  import { useStore } from 'vuex';
  import {ref,reactive,onMounted} from "vue";
  import { startLoading,endLoading } from '@/untils/loading';
  const store=useStore()
  const pjid=store.state.user.pjid
  let fkarea=ref({})
  let fkareas=ref('')
  let yareas=ref({})
  let yarea=ref('')
  let before=ref({})
  let after=ref({})
  let datas=ref({})
    // 获取防控区列表,并且赋值默认防控区为第一个
 const getfkareas=()=>{
  axios.get('/antmonitor/unit/pjas?pjid='+pjid).then((res :any)=>{
  fkareas.value=res.data.data
  fkarea.value=res.data.data[0].aid
  getyqareas()
})
}
getfkareas()
// 获取样区列表
const getyqareas=()=>{
    yareas.value=[]
  axios.get('/antmonitor/unit/pdts?aid='+fkarea.value).then(re=>{
    // re.data.data.unshift({pid:0,pdname:'全部'})
    yareas.value=re.data.data
    yarea.value=re.data.data[0].pid
//   getmaparea()
getboarddata()
  })
}
const getboarddata=()=>{
    startLoading()
    before.value=[]
    after.value=[]
    datas.value=[]
    let params={
        pjid:pjid,
        aid:fkarea.value,
        pid:yarea.value
    }
    axios.get('/antmonitor/visual/effact',{params:params}).then(res=>{
        console.log(res)
        if(res.data){
            before.value=res.data.data[0].bfjc
            after.value=res.data.data[0].afjc
            datas.value=res.data.data[0]
        }
        setTimeout(() => {
        endLoading()
            
        }, 300);
    })
}
</script>

<style scoped>
.box-card{
    margin:10px;
}
</style>
