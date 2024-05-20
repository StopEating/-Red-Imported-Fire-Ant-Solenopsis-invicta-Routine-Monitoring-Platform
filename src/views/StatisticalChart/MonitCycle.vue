<template>
  <div style="display:flex;justify-content: space-around;">
      <!-- 查询/重置/新增 -->
      <el-form :inline="true"  class="demo-form-inline" size="small" style="margin-left:2%;">
       <el-form-item>
        防控区：<el-select v-model="fkarea" class="m-2" placeholder="选择防控区" @change="init()">
        <el-option
        v-for="item in fklist"
        :key="(item as any).aid"
        :label="(item as any).aname"
        :value="(item as any).aid"
        />
        </el-select>
       </el-form-item>
    </el-form>
 
  </div>
  <div style="width:90%;height: 90%;display: flex;flex-direction: row;">
<div id="bar" style="flex:1">

</div>
<!-- <div id="pie" style="flex:3">

</div> -->
   </div>
</template>

<script lang="ts" setup>
 import { defineComponent,reactive,ref,onMounted,onBeforeMount } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import axios from 'axios'
  import {startLoading,endLoading} from '@/untils/loading'
  import { ElMessage,ElMessageBox} from 'element-plus';
  import table2excel from 'js-table2excel';
  import XLXS from "xlsx";
    import FileSaver from "file-saver";
    import type { TableColumnCtx } from 'element-plus'
    import * as echarts from 'echarts';
    let stdate=ref('')
    let eddate=ref('')
    const fklist=ref('')
    let fkarea=ref('')
    const currentPage = ref(1)
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)
    const total=ref()
    const store=useStore()
    const router=useRouter()
    let type=store.state.user.type
    let pjid=store.state.user.pjid
    let aid:any
    let datas:any=reactive([])
    let series:any=[]

    //  初始化
      axios.get('/antmonitor/unit/pjas?pjid='+pjid).then(res=>{
    fklist.value=res.data.data;
    (fkarea.value as any)=res.data.data[0].aid;
    aid=res.data.data[0].aid;
    init()
   
    // initpiechart()
    })

    const init=()=>{
      datas=[]
      series=[]
 startLoading()
    let params={
        pjid:pjid,
        aid:fkarea.value,
    }
    axios.get('/antmonitor/visual/anadis',{params:params}).then(res=>{
   console.log(res)
   res.data.data.forEach((i:any) => {
    datas.push([i.pdname,i.cnum,i.dnum])
    series.push({ type: 'bar' })
   });
   datas.unshift(['product', '周期/天', '间隔/天'],)
        setTimeout(() => {
          initbarchart()
            endLoading()
        }, 500);
    })
    } 
    const initbarchart=()=>{
      console.log(datas)
      var app: any = {};
type EChartsOption = echarts.EChartsOption;

var chartDom = document.getElementById('bar')!;
var myChart = echarts.init(chartDom);
var option: EChartsOption;

option = {
  legend: {},
  tooltip: {
    trigger:'axis'
  },
  dataset: {
    source: datas
  },
  xAxis: { type: 'category' },
  yAxis: {},
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: series
};

option && myChart.setOption(option);
window.addEventListener("resize",function(){
     myChart.resize();
});
    }
    const initpiechart=()=>{
      type EChartsOption = echarts.EChartsOption;

var chartDom = document.getElementById('pie')!;
var myChart = echarts.init(chartDom);
var option: EChartsOption;

option = {
  legend: {
    top: 'bottom'
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  series: [
    {
      name: 'Nightingale Chart',
      type: 'pie',
      radius: [50, 250],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8
      },
      data: [
        { value: 40, name: 'rose 1' },
        { value: 38, name: 'rose 2' },
        { value: 32, name: 'rose 3' },
        { value: 30, name: 'rose 4' },
        { value: 28, name: 'rose 5' },
        { value: 26, name: 'rose 6' },
        { value: 22, name: 'rose 7' },
        { value: 18, name: 'rose 8' }
      ]
    }
  ]
};

option && myChart.setOption(option);
    }

</script>

<style scoped>

</style>
