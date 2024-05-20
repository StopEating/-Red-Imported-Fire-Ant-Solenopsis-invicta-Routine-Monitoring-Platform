<template>
    <div class="map-page-container" style="width:100%">
      <div class="block" style="z-index:99999;display: flex;justify-content: space-between;width:70%;">
        <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> 样区增加 </span>
    </template>
  </el-page-header>
  <el-button @click="changemap">切换地图模式</el-button>
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
            <span style="width:35%;display: inline-block">防控区名称：</span>
    <el-select placeholder="请选择防控区" style="width: 60%;" v-model="fkarea" clearable @change="getfkline">
    <el-option
      v-for="item in fklist"
      :key="(item as any).aid"
      :label="(item as any).aname"
      :value="(item as any).aid"
      >
    </el-option>
  </el-select>
        </div>
    <div style="margin-top:5px">  
        
      <span style="width:35%;display: inline-block">样区名称：</span>
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
<span style="width:35%;display: inline-block;">生境图片：</span>
<!-- :before-upload="beforeAvatarUpload" -->
<el-upload
ref="uploadRef"
    class="avatar-uploader"
    action="''"
    :http-request="httpRequest"
    :auto-upload="false"
    :on-change="handleChange"
    :file-list="fileList"
    :show-file-list="false"
    style="display:inline-bloc;margin-top:5px"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width:100px;height:100px"/>
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
  <!-- <input type="file"  @change="update($event)"> -->
      <div style="margin-top:10px">
        新边界点选择:
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
      import { Plus } from '@element-plus/icons-vue'
      import type { UploadProps } from 'element-plus'
      // 上传图片
    let fileList=reactive([])
    const imageUrl = ref('')
const httpRequest=()=>{1}
  const router=useRouter()
  const store=useStore()
  const id=store.state.user.pjid
  let city=router.currentRoute.value.query.city
 let startpoi=store.state.user.alias
 let fkname=ref('')
 let fklist=ref('')
 let fkarea=ref('')
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
let allpath:any=[]
let yqallpath:any=[]
  //  返回
  const goBack=()=>{
    router.push('/sampleareamanagement/samplearealist')
  }
  // 切换地图模式
  const changemap=()=>{
    router.replace('/sampleareamanagement/samplenormaladd')
  }
// 选择防控区绘制防控区边界
const getfkline=()=>{
  startLoading()
  map.remove(allpath)
  allpath=[]
  map.remove(yqallpath);
  yqallpath=[]
  let fklines:any=[]
  let lls:any
  let yqlines:any=[]
  console.log(fklist.value);
  (fklist.value as any).forEach((i:any) => {
    if(i.aid==fkarea.value&&i.lls)
    {
      axios.get('/antmonitor/unit/pdts?aid='+i.aid).then(res=>{
        let yqlls:any
     res.data.data.forEach((e:any) => {
      let yqoneline:any=[]
      yqlls=(e.lls as any).split(';');  
      yqlls.forEach((j:any) => {
      let lng=j.split(',')[0]*1
          let lat=j.split(',')[1]*1
         let lnglat:any[]=[lng,lat];
        (yqoneline as any).push(lnglat)
     });
     yqlines.push(yqoneline)
      })
     drawyqline(yqlines)
    })
      lls=(i.lls as any).split(';');  
      lls.forEach((i:any) => {
      let lng=i.split(',')[0]*1
          let lat=i.split(',')[1]*1
         let lnglat:any[]=[lng,lat];
        (fklines as any).push(lnglat)
    });
    }
  });
    drawline(fklines)
    setTimeout(() => {
    endLoading()
    }, 500);
}
// 绘制防控区边界
const drawline=(paths:any)=>{
 let len=paths.length
//  绘制防控区
 for(var i=0;i<len;i++){
  let bezierCurve = new AMap.Polygon({
          path:paths,
          // strokeDasharray: [5, 5],
          fillColor: 'transparent',
          strokeOpacity: 1,
          fillOpacity: 0.5,
          strokeColor: 'red',
          strokeWeight: 5,
          strokeStyle: 'solid',
          strokeDasharray: [5, 5],
      });
      // 将需要绘制的线条存储到数组中
      allpath.push(bezierCurve)
      }
      // 绘制防控区
  map.add(allpath);
  (map as any).setFitView(allpath);
}
// 绘制样区边界
const drawyqline=(paths:any)=>{
 let len=paths.length
//  绘制防控区
 for(var i=0;i<len;i++){
 for(let j=0;j<paths[i].length;j++){
  let bezierCurve = new AMap.Polygon({
          path:paths,
          // strokeDasharray: [5, 5],
          fillColor: 'transparent',
          strokeOpacity: 1,
          fillOpacity: 0.5,
          strokeColor: 'blue',
          strokeWeight: 5,
          strokeStyle: 'solid',
          strokeDasharray: [5, 5],
      });
      // 将需要绘制的线条存储到数组中
      yqallpath.push(bezierCurve)
}
map.add(yqallpath);
      }
      // 绘制防控区
  // map.add(yqallpath);
  // (map as any).setFitView(allpath);
}
  const init = (e:any) => {
    axios.get('/antmonitor/unit/pjas?pjid='+id).then(res=>{
        console.log(res)
        fklist.value=res.data.data
    })
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
       (map as any).setFitView();

     }
   })
  
  })
    map = e;
    AMap.plugin(["AMap.MouseTool"],function () {
         mouseTool = new AMap.MouseTool(map);
    });
   
    (map as any).setFitView();
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
      // mappath=[]
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
// 选择图片
const handleChange=(file:any)=>{
       (fileList as any)=[file]
       imageUrl.value = URL.createObjectURL((fileList[0] as any).raw);
    }

  // 调用接口
  const save=()=>{
    let param = new FormData(); //创建form对象
    let polnglats=''
    if(polnglat!==''&&polnglat!==undefined){
      polnglats=(polnglat as any).join(';')}
      if(fkname.value==''){
        ElMessage({
        message: '请输入防控区名称',
        type: 'warning',
      })
   
      } else if(!fileList[0]){
        ElMessage({
        message: '请上传生境图片',
        type: 'warning',
      })
      }else{
        if(polnglats==''){
        ElMessage({
        message: '请选择防控区边界',
        type: 'warning',
      })
      }
      else{
        param.append('aid',fkarea.value)
        param.append('lnglats',polnglats)
        param.append('carea',realVal)
        param.append('pdname',fkname.value)
        param.append('lnglat',(center.value as any))
        param.append('sgtype',(habitat.value as any))
        param.append('createuser',store.state.user.username)
        param.append('file',(fileList[0] as any).raw)
         // 存储边界
      axios({url: '/antmonitor/unit/addpdt',
              data: param,
              method: 'post',
              headers: { 
                'Content-Type': 'multipart/form-data'
              }}).then(res=>{
        reset()
        ElMessage({
        message: '新增样区成功！',
        type: 'success',
      })
      router.push('/sampleareamanagement/samplearealist')
    })
    polnglat=''
    polnglats=''
      }
    }
     
    }
  
  </script>
  
  <style scoped>
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
    /deep/ .avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #9d978c;
  width: 100px;
  height: 100px;
  text-align: center;
}
  </style>