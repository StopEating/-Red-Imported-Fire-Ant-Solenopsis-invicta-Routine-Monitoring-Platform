<template>
  <div id="layout" style="display: flex;flex-direction: column;">
    <div style="width:100%;display: flex;justify-content:space-between;justify-items::end;">
      <div style="margin-left:2%">
        <!-- 防控区切换更新样区 -->
      防控区：<el-select v-model="fkarea" class="m-2" placeholder="防控区" style="width:200px" @change="getyqareas()
">
    <el-option
      v-for="item in fkareas"
      :key="(item as any).aid"
      :label="(item as any).aname"
      :value="(item as any).aid"
    />
  </el-select>
  <!-- 样区更换更新边界 -->
      样区：<el-select v-model="yarea" class="m-2" placeholder="请选择样区" style="width:200px" @change="getmaparea">
    <el-option
      v-for="item in yareas"
      :key="(item as any).pid"
      :label="(item as any).pdname"
      :value="(item as any).pid"
    />
  </el-select>
</div>
    <div class="my-2 flex items-center text-sm" style="margin-right:2%">
    <el-radio-group v-model="type" class="ml-4"  @change="getmaparea">
      <el-radio label="1">蚁情</el-radio>
      <el-radio label="2">防控</el-radio>
    </el-radio-group>
  </div>
  </div>
    <el-row>
  
    <el-col :span="24"><div class="grid-content" id="container">
      <el-amap
        :center="center"
        :zoom="zoom"
        @init="init"
        style="display: flex"
      >
    </el-amap>

    </div></el-col>
   
  </el-row>
  </div>
</template>


<script lang="ts" setup>
  import axios from 'axios'
  import {useRouter} from 'vue-router'
  import { useStore } from 'vuex';
  import {ref,reactive,onMounted} from "vue";
  import { ElMessage } from 'element-plus'
  import { startLoading,endLoading } from '@/untils/loading';
  import * as echarts from 'echarts';

  const zoom = ref(100);
  const center = ref([116.471354, 39.994257]);
  const store=useStore()
  const pjid=store.state.user.pjid
  // 防控区
  const fkareas=ref({})
  let fkarea=ref()
// 样区
  const yareas=ref({})
  let yarea=ref()
  // 防控区边界
  let lnglats:any=[];
  let allpath:any=[];
  // 样区边界
  let pdslngltas:any=[];
  let pdsallpath:any=[];
    // 标记点数据
    let dvlist:any=[]
  let yclist:any=[]
  let fklist:any=[]
  let ychsmarkers:any=[]
  let qymarkers:any=[]
  let dvmarkers:any=[]
  let ycmarkers:any=[]
  let type=ref('1')
  let map:any=null;
   // 初始化绘制边界
   let infoWindow:any
  const init = (e:any) => {
    infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
    // 绘制边界
    AMap.plugin('AMap.DistrictSearch', function () {
    // 创建行政区查询对象
    var district = new AMap.DistrictSearch({
      // 返回行政区边界坐标等具体信息
      extensions: 'all',
      // 设置查询行政区级别为 区 
      level: 'district'
    })
    district.search('广州市', function(status:any, result:any) {
      // 获取边界信息
      var bounds = result.districtList[0].boundaries
      var polygons = []
      if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
         //生成行政区划polygon
         let polygon = new AMap.Polygon({
          map: map,
          strokeWeight: 5,
          path: bounds[i],
          fillOpacity: 0.4,
          fillColor: 'pink',
          strokeColor: 'pink'
         })
          e.add(polygon)
       }
       // 地图自适应
    
     }
     map = e;
   })
  })
  getfkareas()
}

// 获取防控区边界坐标以及获取样区
  const getmaparea=()=>{
    startLoading()
    // 移除防控区边界线，重新绘制，同时将存储所有绘制的边界线的数组置空
 if(allpath.length>0)
 {
  map.remove(allpath)
}
  allpath=[]
  // 将边界线置空，重新赋值
  lnglats=[]
    // 移除样区
    if(pdsallpath.length>0)
    {
      for(let i=0;i<pdsallpath.length;i++)
      {
        map.remove(pdsallpath[i])
      }
    }
      pdsallpath=[]
      pdslngltas=[]
      dvlist=[]
      fklist=[]
      yclist=[]
    let param={
      pjid:pjid,
      aid:fkarea.value,
      pid:yarea.value,
      type:(type.value as any)*1
    }
    endLoading()
    axios.get('/antmonitor/visual/mappdt',{params: param}).then((res :any)=>{
      console.log(res)
   if(res.data.data.lnglats){
    // 转化坐标
    (res.data.data.lnglats.split(';')).forEach((i:any) => {
            let lng=i.split(',')[0]*1
            let lat=i.split(',')[1]*1
           let lnglat:any[]=[lng,lat];
          (lnglats as any).push(lnglat)
        });
    if(lnglats.length>0){
      // 绘制坐标
      setTimeout(() => {
        draw(lnglats)
      }, 500);
    }
  }

  if(res.data.data.pds){
    res.data.data.pds.forEach((i:any) => {
         // 各种list
     if(type.value=='1')
     {
      if(i.dvlist.length>0)
      {
        i.dvlist.forEach((d:any) => {
          dvlist.push(d)
        });
      }
      if(i.yclist.length>0)
      {
        i.yclist.forEach((y:any) => {
          yclist.push(y)
        });
      }
    }
    if(type.value=='2')
    {
      if(i.fklist.length>0)
      {
        i.fklist.forEach((f:any) => {
          fklist.push(f)
        });
      }
    }
    let pds:any=[]
      i.lnglats.split(';').forEach((e:any) => {
        let lng=e.split(',')[0]*1
            let lat=e.split(',')[1]*1
           let lnglat:any[]=[lng,lat];
          (pds as any).push(lnglat)
      });
      pdslngltas.push(pds)
    });
    if(pdslngltas.length>0)
    {
      setTimeout(() => {
        drawpds(pdslngltas)
            // 绘制标记点
  if(type.value=='1')
  {
    drawycmarkers(dvlist,yclist)
  }
  if(type.value=='2')
  {
    drawfkmarkers(fklist)
  }
      }, 500);
    }
  }
setTimeout(()=>{
  endLoading()
},500)
  })
  }
  // 获取防控区列表,并且赋值默认防控区为第一个
 const getfkareas=()=>{
  axios.get('/antmonitor/unit/pjas?pjid='+pjid).then((res :any)=>{
  fkareas.value=res.data.data
  fkarea.value=res.data.data[0].aid
  getyqareas()
})
}
// 获取样区列表
const getyqareas=()=>{
  axios.get('/antmonitor/unit/pdts?aid='+fkarea.value).then(re=>{
    re.data.data.unshift({pid:0,pdname:'全部'})
    yareas.value=re.data.data
    yarea.value=re.data.data[0].pid
  getmaparea()
  })

}
// 初始化绘制第一个防控区
// setTimeout(() => {
  // getfkareas()
// }, 1000);

// 绘制防控区
const draw=(paths:any)=>{
   let len=paths.length
  //  绘制防控区
   for(let i=0;i<len;i++){
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
// 绘制样区
const drawpds=(pdslngltas:any)=>{
  
  for(let i=0;i<pdslngltas.length;i++){
  let pdspaths:any=[]
   for(let j=0;j<pdslngltas[i].length;j++){
    let bezierCurve = new AMap.Polygon({
            path:pdslngltas[i],
            // strokeDasharray: [5, 5],
            fillColor: 'transparent',
            strokeOpacity: 1,
            fillOpacity: 0.5,
            strokeColor: 'blue',
            strokeWeight: 2,
            strokeStyle: 'solid',
            strokeDasharray: [5, 5],
        });
        // 将需要绘制的线条存储到数组中
        pdspaths.push(bezierCurve)   
  }
  pdsallpath.push(pdspaths)
    }
      // 绘制样区
      for(let i=0;i<pdsallpath.length;i++)
      {
        map.add(pdsallpath[i])
      }

}

// 绘制标记点(蚁巢)
const drawycmarkers=(dv:any,yc:any)=>{
  (map as any).remove(ychsmarkers);
  (map as any).remove(qymarkers);
  (map as any).remove(dvmarkers);
  (map as any).remove(ycmarkers);

  dvmarkers=[]
  ycmarkers=[]
  qymarkers=[]
  ychsmarkers=[]
  if(dv.length>0)
  {
    dv.forEach(function(marker:any) {
      let lng=(marker as any).lnglat.split(',')[0]
      let lat=(marker as any).lnglat.split(',')[1]
            //标记点
          if(marker.grade==0)
          {
            let nocontent=new AMap.Marker({
                map: map,
                icon: new AMap.Icon({     
                image: require('/static/img/0.png'),
                size: new AMap.Size(25, 25),  //图标大小
                imageSize: new AMap.Size(25,25),
              }),
            position: [lng,lat],
            offset: new AMap.Pixel(-13, -30)
            });
        let img
        if((marker as any).imgurl!==null)
        {
          img=(marker as any).imgurl.split(';');
        }
       if(img)
        {
           // 设置信息窗体
           (nocontent as any).content = `<div>
            <div>防控时间：${(marker as any).acttime}</div>
            <div>蚂蚁数量:${(marker as any).antnum}</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div>装置编号:${(marker as any).dvorn}</div>
              <div>蚁情等级:${(marker as any).grade}</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>
               <div style="width:100px;height:100px">
              <img src='${(marker as any).anturl}' style="width:100px;height:100px"/>
              </div>
              <a href="${(marker as any).anturl}" target='blank'>打开图片</a>
              </div>
              `; 
              (nocontent as any).on('click', markerClick);
        }
            // 设置标记点文本
              //默认初始化不出现信息窗体,打开初始化就出现信息窗体
              // markerss.emit('click', {target: markerss});
              (dvmarkers as any).push(nocontent);
              // (delmarkers as any).push(markerss)
          }
          if(marker.grade==1)
          {
            let nocontent=new AMap.Marker({
                map: map,
                icon: new AMap.Icon({     
                image: require('/static/img/1.png'),
                size: new AMap.Size(25, 25),  //图标大小
                imageSize: new AMap.Size(25,25),
              }),
            position: [lng,lat],
            offset: new AMap.Pixel(-13, -30)
            });
        let img
        if((marker as any).imgurl!==null)
        {
          img=(marker as any).imgurl.split(';');
        }
       if(img)
        {
           // 设置信息窗体
           (nocontent as any).content = `<div>
            <div>防控时间：${(marker as any).acttime}</div>
            <div>蚂蚁数量:${(marker as any).antnum}</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div>装置编号:${(marker as any).dvorn}</div>
              <div>蚁情等级:${(marker as any).grade}</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>
               <div style="width:100px;height:100px">
              <img src='${(marker as any).anturl}' style="width:100px;height:100px"/>
              </div>
              <a href="${(marker as any).anturl}" target='blank'>打开图片</a>
              </div>
              `; 
              (nocontent as any).on('click', markerClick);
        }
            // 设置标记点文本
              //默认初始化不出现信息窗体,打开初始化就出现信息窗体
              // markerss.emit('click', {target: markerss});
              (dvmarkers as any).push(nocontent);
              // (delmarkers as any).push(markerss)
          }
          if(marker.grade==2)
          {
            let nocontent=new AMap.Marker({
                map: map,
                icon: new AMap.Icon({     
                image: require('/static/img/2.png'),
                size: new AMap.Size(25, 25),  //图标大小
                imageSize: new AMap.Size(25,25),
              }),
            position: [lng,lat],
            offset: new AMap.Pixel(-13, -30)
            });
        let img
        if((marker as any).imgurl!==null)
        {
          img=(marker as any).imgurl.split(';');
        }
       if(img)
        {
           // 设置信息窗体
           (nocontent as any).content = `<div>
            <div>防控时间：${(marker as any).acttime}</div>
            <div>蚂蚁数量:${(marker as any).antnum}</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div>装置编号:${(marker as any).dvorn}</div>
              <div>蚁情等级:${(marker as any).grade}</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>
               <div style="width:100px;height:100px">
              <img src='${(marker as any).anturl}' style="width:100px;height:100px"/>
              </div>
              <a href="${(marker as any).anturl}" target='blank'>打开图片</a>
              </div>
              `; 
              (nocontent as any).on('click', markerClick);
        }
            // 设置标记点文本
              //默认初始化不出现信息窗体,打开初始化就出现信息窗体
              // markerss.emit('click', {target: markerss});
              (dvmarkers as any).push(nocontent);
              // (delmarkers as any).push(markerss)
          }
          if(marker.grade==3)
          {
            let nocontent=new AMap.Marker({
                map: map,
                icon: new AMap.Icon({     
                image: require('/static/img/3.png'),
                size: new AMap.Size(25, 25),  //图标大小
                imageSize: new AMap.Size(25,25),
              }),
            position: [lng,lat],
            offset: new AMap.Pixel(-13, -30)
            });
        let img
        if((marker as any).imgurl!==null)
        {
          img=(marker as any).imgurl.split(';');
        }
       if(img)
        {
           // 设置信息窗体
           (nocontent as any).content = `<div>
            <div>防控时间：${(marker as any).acttime}</div>
            <div>蚂蚁数量:${(marker as any).antnum}</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div>装置编号:${(marker as any).dvorn}</div>
              <div>蚁情等级:${(marker as any).grade}</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>
               <div style="width:100px;height:100px">
              <img src='${(marker as any).anturl}' style="width:100px;height:100px"/>
              </div>
              <a href="${(marker as any).anturl}" target='blank'>打开图片</a>
              </div>
              `; 
              (nocontent as any).on('click', markerClick);
        }
            // 设置标记点文本
              //默认初始化不出现信息窗体,打开初始化就出现信息窗体
              // markerss.emit('click', {target: markerss});
              (dvmarkers as any).push(nocontent);
              // (delmarkers as any).push(markerss)
          }
          if(marker.grade==4)
          {
            let nocontent=new AMap.Marker({
                map: map,
                icon: new AMap.Icon({     
                image: require('/static/img/4.png'),
                size: new AMap.Size(25, 25),  //图标大小
                imageSize: new AMap.Size(25,25),
              }),
            position: [lng,lat],
            offset: new AMap.Pixel(-13, -30)
            });
        let img
        if((marker as any).imgurl!==null)
        {
          img=(marker as any).imgurl.split(';');
        }
       if(img)
        {
           // 设置信息窗体
           (nocontent as any).content = `<div>
            <div>防控时间：${(marker as any).acttime}</div>
            <div>蚂蚁数量:${(marker as any).antnum}</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div>装置编号:${(marker as any).dvorn}</div>
              <div>蚁情等级:${(marker as any).grade}</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>
               <div style="width:100px;height:100px">
              <img src='${(marker as any).anturl}' style="width:100px;height:100px"/>
              </div>
              <a href="${(marker as any).anturl}" target='blank'>打开图片</a>
              </div>
              `; 
              (nocontent as any).on('click', markerClick);
        }
            // 设置标记点文本
              //默认初始化不出现信息窗体,打开初始化就出现信息窗体
              // markerss.emit('click', {target: markerss});
              (dvmarkers as any).push(nocontent);
              // (delmarkers as any).push(markerss)
          }
          if(marker.grade==5)
          {
            let nocontent=new AMap.Marker({
                map: map,
                icon: new AMap.Icon({     
                image: require('/static/img/5.png'),
                size: new AMap.Size(25, 25),  //图标大小
                imageSize: new AMap.Size(25,25),
              }),
            position: [lng,lat],
            offset: new AMap.Pixel(-13, -30)
            });
        let img
        if((marker as any).imgurl!==null)
        {
          img=(marker as any).imgurl.split(';');
        }
       if(img)
        {
           // 设置信息窗体
           (nocontent as any).content = `<div>
            <div>防控时间：${(marker as any).acttime}</div>
            <div>蚂蚁数量:${(marker as any).antnum}</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div>装置编号:${(marker as any).dvorn}</div>
              <div>蚁情等级:${(marker as any).grade}</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>
               <div style="width:100px;height:100px">
              <img src='${(marker as any).anturl}' style="width:100px;height:100px"/>
              </div>
              <a href="${(marker as any).anturl}" target='blank'>打开图片</a>
              </div>
              `; 
              (nocontent as any).on('click', markerClick);
        }
            // 设置标记点文本
              //默认初始化不出现信息窗体,打开初始化就出现信息窗体
              // markerss.emit('click', {target: markerss});
              (dvmarkers as any).push(nocontent);
              // (delmarkers as any).push(markerss)
          }
        });
  }
  if(yc.length>0)
  {
    yc.forEach(function(marker:any) {
      let lng=(marker as any).lnglat.split(',')[0]
      let lat=(marker as any).lnglat.split(',')[1]
            //标记点
            let nocontent=new AMap.Marker({
                map: map,
                icon: new AMap.Icon({     
                image: require('/static/img/yc0.png'),
                size: new AMap.Size(25, 25),  //图标大小
                imageSize: new AMap.Size(25,25),
              }),
            position: [lng,lat],
            offset: new AMap.Pixel(-13, -30)
            });
        let img
        if((marker as any).imgurl!==null)
        {
          img=(marker as any).imgurl.split(';');
        }
       if(img)
        {
           // 设置信息窗体
           (nocontent as any).content = `<div>
            <div>防控时间：${(marker as any).acttime}</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>
               <div style="width:100px;height:100px">
              <img src='${(marker as any).anturl}' style="width:100px;height:100px"/>
              </div>
              <a href="${(marker as any).anturl}" target='blank'>打开图片</a>
              </div>
              `; 
              (nocontent as any).on('click', markerClick);
        }
            // 设置标记点文本
              //默认初始化不出现信息窗体,打开初始化就出现信息窗体
              // markerss.emit('click', {target: markerss});
              (ycmarkers as any).push(nocontent);
              // (delmarkers as any).push(markerss)
        
        });
  }
}
// 绘制标记点(防控)
const drawfkmarkers=(fk:any)=>{
  (map as any).remove(ychsmarkers);
  (map as any).remove(qymarkers);
  (map as any).remove(dvmarkers);
  (map as any).remove(ycmarkers);
  dvmarkers=[]
  ychsmarkers=[]
  qymarkers=[]
  ychsmarkers=[]
  fk.forEach(function(marker:any) {
      let lng=(marker as any).lnglat.split(',')[0]
      let lat=(marker as any).lnglat.split(',')[1]
            //标记点
          if(marker.ftype==1){
            let nocontent=new AMap.Marker({
                map: map,
                icon: new AMap.Icon({     
                image: require('/static/img/ychs.png'),
                size: new AMap.Size(25, 25),  //图标大小
                imageSize: new AMap.Size(25,25),
              }),
            position: [lng,lat],
            offset: new AMap.Pixel(-13, -30)
            });
        let img
        if((marker as any).imgurl!==null)
        {
          img=(marker as any).imgurl.split(';');
        }
           
            // (markerss as any).on('click', markerClick);
            // 设置标记点文本
        //     (markerss as any).setLabel({
        //     direction:'right',
        //     offset: new AMap.Pixel(10, 0),  //设置文本标注偏移量
        //     content: "<div class='info'>"+`${(marker as any).addr}`+"</div>", //设置文本标注内容
        // });
       if(img)
        {
          if(marker.ftype==1)
          {
            marker.ftype='蚁巢环施'
          }
           // 设置信息窗体
           (nocontent as any).content = `<div>
            <div>防控时间：${(marker as any).acttime}</div>
            <div>防控方式:${(marker as any).ftype}</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div>药品用量:${(marker as any).psnum}克</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>`; 
              (nocontent as any).on('click', markerClick);
        }
            // 设置标记点文本
              //默认初始化不出现信息窗体,打开初始化就出现信息窗体
              // markerss.emit('click', {target: markerss});
              (ychsmarkers as any).push(nocontent);
              // (delmarkers as any).push(markerss)
          }
          if(marker.ftype==2)
          {
            let nocontent=new AMap.Marker({
                map: map,
                icon: new AMap.Icon({     
                image: require('/static/img/qy.jpg'),
                size: new AMap.Size(25, 25),  //图标大小
                imageSize: new AMap.Size(25,25),
              }),
            position: [lng,lat],
            offset: new AMap.Pixel(-13, -30)
            });
        let img
        if((marker as any).imgurl!==null)
        {
          img=(marker as any).imgurl.split(';');
        }
       if(img)
        {
          if(marker.ftype==2)
          {
            marker.ftype='区域撒播'
          }
           // 设置信息窗体
           (nocontent as any).content = `<div>
            <div>防控时间：${(marker as any).acttime}</div>
            <div>防控方式:${(marker as any).ftype}</div>
              <div>经纬度:${(marker as any).lnglat}</div>
              <div>药品用量:${(marker as any).psnum}克</div>
              <div style="width:100px;height:100px">
              <img src='${img[0]}' style="width:100px;height:100px"/>
              </div>
              <a href="${img[0]}" target='blank'>打开图片</a>
              </div>`; 
              (nocontent as any).on('click', markerClick);
        }
            // 设置标记点文本
              //默认初始化不出现信息窗体,打开初始化就出现信息窗体
              // markerss.emit('click', {target: markerss});
              (qymarkers as any).push(nocontent);
              // (delmarkers as any).push(markerss)
          }
        });
}
// 信息窗体显示以及关闭
function markerClick(e:any) {
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());
    }
</script>

<style scoped>
#layout{
  width:100%;
  height: 100%;
}
.el-row {
  /* margin-bottom: 20px; */
  height: 100%;
  width: 100%;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  height: 100%;

}
.left{
  border-bottom: 1px solid #eee;
}
</style>
