<template>
    <div class="map-page-container" style="width:100%">
      <div class="block" style="z-index:99999;display: flex;justify-content: space-between;width:70%;">
        <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> 防控区增加 </span>
    </template>
  </el-page-header>
  <el-button @click="changemap">切换地图模式</el-button>
      </div>
      <div class="box">
</div>
    <!-- 地图 -->
    <div style="width:75%;height:99%;display:inline-block;margin:0;padding:0" >
        <el-amap
        :center="center"
        :zoom="zoom"
        @init="init"
        style="display: flex"
      >
      <el-amap-layer-satellite></el-amap-layer-satellite>
    </el-amap>
    </div>
    <!-- 右边显示 -->
    <div style="width:24%;height:99%;background-color:#f4f4f4;display: inline-block;margin:0;padding:0;overflow: auto;padding-left:1%">
      <div>  
      <span style="width:35%;display: inline-block">防控区搜索：</span>
      <el-input
      type="textarea"
      v-model="search"
      autosize
      placeholder="请输入内容"
      clearable style="width:60%;vertical-align: middle;" id='tipinput'></el-input>
    
  </div>
    <div style="margin-top:5px">  
      <span style="width:35%;display: inline-block">防控区名称：</span>
      <el-input
      type="textarea"
      autosize
      placeholder="请输入内容"
      v-model="fkname"
      clearable style="width:60%;vertical-align: middle;">
    </el-input>
  </div>
 
   <div style="margin-top:5px"> 
    <span style="width:35%;display: inline-block;">生境:</span>
    <el-select v-model="habitat" placeholder="请选择" style="width:60%;">
    <el-option
      v-for="item in habitats"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</div>
      <div style="margin-top:10px">
        新边界点选择:
        <!-- <ul style="padding-left:2em;font-size: 10px;;">
            <li>点击开始：开始画边界，左侧地图上点击开始采集边界点，双击结束采集</li>
            <li style="line-height: 30px;">点击停止：结束画边界</li>
            <li>点击重置：重新画边界</li>
        </ul> -->
    </div>
  <div style="width:100%;padding-top:20px;overflow: hidden;">
  <div style="display:flex">
    <el-button plain type="primary" @click="start">开始</el-button>
    <span style="text-indent:1em;margin-left:3px;font-size: 10px;align-items: center;">
      点击后，在左侧地图通过鼠标左键进行边界点选取，双击结束边界点选取过程
    </span>
  </div>
    <div style="display:flex;margin:5px 0px;align-items: center;">
      <el-button type="danger" plain @click="end">停止</el-button>
      <span style="text-indent: 1em;margin-left:3px;font-size: 10px;">
        点击后，结束边界点选取过程，保留最后一个多边形作为防控区边界
      </span>
    </div>
   <div style="display:flex;align-items: center;">
    <el-button type="warning" plain @click="reset">重置</el-button>
    <span style="text-indent: 1em;margin-left:3px;font-size: 10px;">
      点击后，清除刚刚所选择的全部边界点
    </span>
   </div>
    <!-- <el-button type="primary" plain>对比</el-button> -->
  </div>
  <el-card shadow="always" class="card" placeholder="边界点坐标存放区">
    <div class="item">
      <template v-if="paths.length>0">
        <span v-for="item in paths" :key="item" style="margin-left:2px">
                {{item}}
        </span>
       </template>
       <template v-else>
       <span>{{item}}</span>
       </template>
    </div>
  </el-card>
   <div style="text-align: center;">
    <el-input v-model="areameasure" class="w-50 m-2" placeholder="Please Input" style="width:200px;margin:0 auto;margin-bottom: 5px;margin-top:15px"/>亩
    <el-button type="primary" @click="calarea" style="display:block;margin: 0 auto;">计算边界面积</el-button>
  <el-button type="success" style="display:block;margin:0 auto;margin-top: 20px;" @click="save"> 更新保存</el-button>
  
  </div>
    </div>
    </div>
  </template>
  <script lang="ts" setup>
  import axios from 'axios'
  import {useRouter} from 'vue-router'
  import { useStore } from 'vuex';
  import {ref,reactive,onMounted} from "vue";
  import { ElMessage } from 'element-plus'
  import { startLoading,endLoading } from '@/untils/loading';
  
  const router=useRouter()
  const store=useStore()
  const id=store.state.user.pjid
  let city=router.currentRoute.value.query.city
 let startpoi=store.state.user.alias
 let fkname=ref('')
 const habitats=[{label:'全部',value:0},{label:'公园',value:1},{label:'景区',value:2},{label:'广场',value:3},{label:'园区',value:4},{label:'厂区',value:5},{label:'学校',value:6},{label:'村庄',value:7},{label:'社区',value:8},{label:'种养基地',value:9},{label:'企事单位',value:10}]
  let habitat=ref(0)
  const zoom = ref(35);
  const center = ref([116.471354, 39.994257]);
  let oldaname:any
  let item=ref('新选择的边界点存放区')
    let bjfks=[]//防控边界
   let bjfkspy=reactive([])//防控边界数组
  //  防控边界数组
    let bjfksarea:any[]=[]
  let paths=reactive([])
  // 面积
  let areameasure=ref(0)
  let map:any = null;
  // 样区点
  let markers=reactive([])
  let nocontents=reactive([])
   interface options{
    label:string
    value:string
   }
   let area=ref('')
   let areas=reactive<options[]>([])
  let mouseTool:any
//搜索防控区
let search=ref('')
  //  返回
  const goBack=()=>{
    router.push('/prectrlmanagement/prectrllist')
  }
  // 切换地图模式
  const changemap=()=>{
    router.push('/prectrlmanagement/prectrlnormaladd')
  }
  const init = (e:any) => {
 
    // 绘制边界
    AMap.plugin('AMap.DistrictSearch', function () {
    // 创建行政区查询对象
    var district = new AMap.DistrictSearch({
      // 返回行政区边界坐标等具体信息
      extensions: 'all',
      // 设置查询行政区级别为 区 
      level: 'district'
    })
    let alias
    if(city){
      if(city?.includes('-')){
    alias=city
    city=(alias as any).split('-')[1]
  }
    }else{
      city=startpoi
    }
  
    district.search(city, function(status:any, result:any) {
      // 获取边界信息
      var bounds = result.districtList[0].boundaries
      var polygons = []
      if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
         //生成行政区划polygon
         var polygon = new AMap.Polygon({
          map: map,
          strokeWeight: 5,
          path: bounds[i],
          fillOpacity: 0.2,
          fillColor: 'pink',
          strokeColor: 'red'
         })
          e.add(polygon)
       }
       // 地图自适应
       (map as any).setFitView();
     }
   })
  
  })
   
    map = e;
    //  (map as any).setFitView();
    //输入提示
    let autoOptions = {
        input: "tipinput"
    };
    console.log(autoOptions)
    let auto = new AMap.Autocomplete(autoOptions);
    let placeSearch = new AMap.PlaceSearch({
        map: map
    });  //构造地点查询类
    console.log(auto)
      AMap.Event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
    function select(e:any) {
      console.log(e)
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);  //关键字查询查询
    }
    AMap.plugin(["AMap.MouseTool"],function () {
         mouseTool = new AMap.MouseTool(map);
    });
   
    

  }

  
  const start=()=>{
    draw()
  }
  let overlays:any = [];
  let mappath:any=[];
  let pois:any=[];
  let endpy:any=[];
  let measure:any=[];
  function draw(){
    paths.length=0
    mouseTool.polygon({
              fillColor:'#00b0ff',
              strokeColor:'#80d8ff'
              //同Polygon的Option设置
            });
            // 绘制时计算面积
            // mouseTool.measureArea({
            //     fillColor:'#00b0ff',
            //   strokeColor:'#80d8ff'
            //   //同 Polygon 的 Option 设置
            // });
            mouseTool.on('draw',function(e:any){
        pois=[];
        measure=[];
        overlays=[];
       let lnglats:any=[];
       (mappath as any).push(e.obj)
        let path=e.obj.getPath()
        path.forEach((i:any) => {
           let lng= i.lng;
           let lat= i.lat;
            (overlays as any).push(lng+','+lat+';');
            (lnglats as any).push([lng,lat]);
            // 为了计算面积
           ( measure as any).push([lng,lat]);
            // 为了停止画图时回显多边形
           (pois as any).push(lnglats)
        });
        ElMessage({
        message: '您已完成边界绘制，如若继续绘制将保留最后一个多边形',
        type: 'warning',
      })
    }) ;
  }
  // 结束画图
  let realVal:any
  let areame
  let polnglat=''
   const end=()=>{
    polnglat='';
    (polnglat as any)= measure;
    paths.length=0;
    overlays.forEach((i:any) => {
        paths.push(i)
    });
    // 计算面积
  areame = Math.round(AMap.GeometryUtil.ringArea(measure))/667;
    // 截取当前数据到小数点后两位 （四舍五入）
    realVal = parseFloat((areame as any)).toFixed(2)
  
    mouseTool.close(true)//会将原本画的多边形去除
    overlays=[]
    endpy=[]
    // 回显多边形
    for (var i = 0, l =pois.length; i < l; i++) {
         //生成行政区划polygon
         var polygon = new AMap.Polygon({
          map: map,
          path:pois[i],
          strokeWeight: 2,
          fillOpacity: 0.8,
          fillColor:'#c7d2e7',
          strokeColor:'#80d8ff'
         });
        (endpy as any).push(polygon);
          (map as any).add(polygon)
       }
  
   }
  //  计算面积
   const calarea=()=>{
    // 计算面积
      areame = Math.round(AMap.GeometryUtil.ringArea(measure))/667;
        // 截取当前数据到小数点后两位 （四舍五入）
      realVal = parseFloat((areame as any)).toFixed(2)
      areameasure.value=realVal as any 
   }
  // 清除覆盖物/重置 将数组清空
   const reset=()=>{
   ( map as any).remove(mappath);
   (map as any).remove(endpy)
   polnglat='';
   mappath=[]
   overlays=[]
   pois=[]
   endpy=[]
   measure=[]
   paths.length=0
   }
  // 调用接口
  const save=()=>{
    let polnglats=''
    if(polnglat!==''&&polnglat!==undefined){
      polnglats=(polnglat as any).join(';')}
      if(fkname.value==''){
        ElMessage({
        message: '请输入防控区名称',
        type: 'warning',
      })
   
      } else{
        if(polnglats==''){
        ElMessage({
        message: '请选择防控区边界',
        type: 'warning',
      })
      }else{
         // 存储边界
      axios.post('/antmonitor/unit/addpja?pjid='+id+'&lnglats='+polnglats+'&carea='+realVal+'&aname='+fkname.value+'&lnglat='+center.value+'&sgtype='+habitat.value+'&createuser='+store.state.user.username).then(res=>{
        reset()
        ElMessage({
        message: '新增防控区成功！',
        type: 'success',
      })
      router.push('/prectrlmanagement/prectrllist')
    })
    polnglat=''
    polnglats=''
      }
    }
     
    }

  </script>
  
  <style scoped lang="less">
   
    li{
      list-style: none;
    }
  .demo-image__error .image-slot {
    font-size: 30px;
  }
  .demo-image__error .image-slot .el-icon {
    font-size: 30px;
  }
  .demo-image__error .el-image {
    width: 100%;
    height: 200px;
  }
    .map-page-container{
      width: 100%;
      height:100%;
      position:relative;
      top:0;
      left:0;
    }
    .block{
      position: absolute;
    left: 2%;
    text-align: left;
    width:80%
  }
  
   .icon{
    width:20px;
    height:20px;
    -webkit-border-radius: 50% 50% 50% 0;
      border-radius: 50% 50% 50% 0;
    background: green;
      border:1px solid white;
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
      -o-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      transform: rotate(-45deg);
      margin:5px;
      display: inline-block;
      vertical-align: middle;
  }
  .card{
    width:95%;
    height:40%;
    overflow-y: auto;
    margin:0 auto;
    margin-top:8px;
    word-break: break-all;
  }
  .item{
    font-size: 10px;
  }
  </style>
  <style lang="less" scoped>
    /deep/ .el-main{
      width:50%!important;
    }
    /deep/.el-select-dropdown__list{
        padding: 0 32px 0 20px!important;
    }
  </style>