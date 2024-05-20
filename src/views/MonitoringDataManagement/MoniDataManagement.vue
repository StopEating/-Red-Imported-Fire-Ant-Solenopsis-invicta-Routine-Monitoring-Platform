<template>
    <div class="list">
        <!-- 查询/重置/新增 -->
      <el-form :inline="true" :model="listform" class="demo-form-inline" size="small" style="margin-left:2%;">
       <el-form-item>
        <el-select v-model="fkarea" class="m-2" placeholder="Select" >
        <el-option
        v-for="item in fklist"
        :key="(item as any).aid"
        :label="(item as any).aname"
        :value="(item as any).aid"
        />
        </el-select>
       </el-form-item>
        <el-form-item>
        <el-input v-model="listform.code" placeholder="输入装置编号查询" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listform.name" placeholder="输入工作人员姓名查询" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="record" class="m-2" placeholder="Select" >
        <el-option
        v-for="item in records"
        :key="(item as any).value"
        :label="(item as any).label"
        :value="(item as any).value"
        />
        </el-select>
       </el-form-item>
       <el-form-item>
        <el-select v-model="uploadrecord" class="m-2" placeholder="Select" >
        <el-option
        v-for="item in uploadrecords"
        :key="(item as any).value"
        :label="(item as any).label"
        :value="(item as any).value"
        />
         </el-select>
       </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="init()">查询</el-button>
          <el-button type="primary" @click="reset()">重置</el-button>
          <el-button type="primary" @click="exportClick()">数据导出</el-button>
      </el-form-item>
      <el-date-picker
        v-model="stdate"
        type="date"
        placeholder="起始日期"
        format="YYYY/MM/DD"
        value-format="YYYY-MM-DD"
      />
      <el-date-picker
        v-model="eddate"
        type="date"
        placeholder="终止日期"
        format="YYYY/MM/DD"
        value-format="YYYY-MM-DD"
      />
    </el-form>
    <!-- 成员列表 -->
    <el-table :data="tableData" style="width:90%;text-align:left;margin:5px auto!important;margin-left:2%!important;"  highlight-current-row>
      <el-table-column prop="aname" label="防控区名称" width="200" />
      <el-table-column prop="pdname" label="样区名称" width="100" />
      <el-table-column prop="acttime" label="监测日期" width="150" />
      <el-table-column prop="dvorn" label="装置编号" width="100" />
      <el-table-column prop="cuser" label="工作人员" width="100" />
      <el-table-column prop="grade" label="疫情等级" width="100" />
      <el-table-column prop="isexc" label="异常记录" width="100" >
        <template #default="scope">
            <span size="small"  style="margin-right:10px;color:#67c23a" @click="check(scope.row.id)" v-if="scope
            .row.isexc=='是'"><el-icon style="vertical-align: middle;"><CircleCheck /></el-icon></span>
            <span size="small"  style="margin-right:10px;color:#f56c6c" @click="check(scope.row.id)" v-if="scope
            .row.isexc=='否'"><el-icon style="vertical-align: middle;"><CircleClose /></el-icon></span>
        </template>
      </el-table-column>
      <el-table-column prop="isudl" label="是否已上传" width="100" >
        <template #default="scope">
            <span size="small"  style="margin-right:10px;color:#67c23a" @click="check(scope.row.id)" v-if="scope
            .row.isudl=='是'"><el-icon style="vertical-align: middle;"><CircleCheck /></el-icon></span>
            <span size="small"  style="margin-right:10px;color:#f56c6c" @click="check(scope.row.id)" v-if="scope
            .row.isudl=='否'"><el-icon style="vertical-align: middle;"><CircleClose /></el-icon></span>
        </template>
      </el-table-column>
      <el-table-column prop="createdate" label="监测数据" width="100" >
        <template #default="scope">
            <el-button size="small"  style="margin-right:10px" @click="check(scope.row.id)" v-if="scope
            .row.isudl=='是'">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="管理功能" width="200" style="text-align:center">
        <template #default="scope">
            <!-- @click="modifyitem(scope.row.id)"  -->
            <el-button size="small" type="danger" @click="del(scope.$index,scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
  
    </el-table>
   <!-- 查看信息 -->
   <el-drawer
   v-model="table"
    title="监测数据"
    direction="rtl"
    size="85%"
  >
  <div id="dataechart" style="width:100%;height:70%">
  </div>
  </el-drawer>
  <!-- 折线图转折点信息 -->
     <el-dialog v-model="dialogFormVisible" title="监测详细数据" style="width:40%" draggable>
    <el-form v-model="editForm">
      <el-form-item label="日期" :label-width="formLabelWidth">
        <el-input  v-model="(editForm as any).coldate" autocomplete="off" style="width:300px" disabled/>
      </el-form-item>
      <el-form-item label="蚂蚁数量/个" :label-width="formLabelWidth">
        <el-input v-model="(editForm as any).anum" autocomplete="off" style="width:300px" disabled/>
      </el-form-item>
      <el-form-item label="环境数据" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="(editForm as any).envs" autocomplete="off"  style="width:300px" disabled/>
      </el-form-item>
      <!-- <el-form-item label="经纬度" :label-width="formLabelWidth">
        <el-input v-model="(editForm as any).lnglat" autocomplete="off"  style="width:300px" disabled/>
      </el-form-item> -->
      <el-form-item label="照片" :label-width="formLabelWidth">
        <div class="demo-image__preview">
    <el-image
      style="width: 100px; height: 100px"
      :src="(editForm as any).imgurl"
      :zoom-rate="1.2"
      :preview-src-list="[(editForm as any).imgurl]"
      :initial-index="4"
      fit="cover"
    >
    <template #placeholder>
          <div class="image-slot" style="width:100%;height:100%">
           <el-icon style="width:50px;height:50px"><icon-picture style="width:50px;height:50px"/></el-icon>
           <div>正在加载中...</div>
          </div>
        </template>
  </el-image>
  </div>
      </el-form-item>
    </el-form>
            </el-dialog>
    <!-- 分页 -->
    <div class="demo-pagination-block">
       <el-pagination
       v-model:currentPage="currentPage"
        page-size="10"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        style="width:30%;margin:0 auto"
      />
    </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineComponent,reactive,ref,onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import axios from 'axios'
  import {startLoading,endLoading} from '@/untils/loading'
  import { ElMessage,ElMessageBox} from 'element-plus';
  import * as echarts from 'echarts';
  import { Picture as IconPicture } from '@element-plus/icons-vue'
  import { isModuleDeclaration } from '@babel/types';
  import table2excel from 'js-table2excel';

    let stdate=ref('')
    let eddate=ref('')
    const records=[{label:'异常记录',value:"true"},{label:'正常记录',value:"false"},{label:'全部',value:''}]
    let record=ref("")
    const uploadrecords=[{label:'已上传',value:"true"},{label:'未上传',value:"false"},{label:'全部',value:''}]
    let uploadrecord=ref("")
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
    let tableData=reactive([])

    let pjid=store.state.user.pjid
    // 折线图数据
    let timedata:any=reactive([])
    let antdata:any=reactive([])
    let seriesdata:any=[]
    const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
    }
    const handleCurrentChange = (val: number) => {
    init((val-1)*10)
    }
    // 设置表格特定行背景色
    const tableRowClassName = (row:any,rowIndex:any) => {
      console.log()
      if(row.row.isexc=='是')
      {
        return 'warning-row'
      }
      return ''
    }
    const listform= reactive({
    name: '',
    code: '',
    })
    startLoading()
    //  初始化
    axios.get('/antmonitor/unit/pjas?pjid='+pjid).then(res=>{
    res.data.data.unshift({aid:0,aname:'全部防控区'})
    fklist.value=res.data.data;
    (fkarea.value as any)=0
    init()
    })
    // 初始化数据
    const init=(start=0,rows=10)=>{
      startLoading()
      tableData.length=0;
      let isexc=record.value
      let isudl=uploadrecord.value
    let params={
        pjid:pjid,
        aid:fkarea.value,
        dvorn:listform.code,
        cuser:listform.name,
        stdate:stdate.value,
        eddate:eddate.value,
        isexc:isexc,
        isudl:isudl,
        start:start,
        rows:rows
    }
    
    axios.get('/antmonitor/unit/listdvdt',{params:params}).then(res=>{
      console.log(res)
      if(res.data.rows){
        res.data.rows.forEach((i:any) => {
          if(i.isexc==false)
          {
            i.isexc='否'
          }else{
            i.isexc='是'
          }
          if(i.isudl==false)
          {
            i.isudl='否'
          }else{
            i.isudl='是'
          }
        });
      }
        total.value=res.data.total;
        res.data.rows.forEach((i:any) => {
          (tableData as any).push(i)
        });

        setTimeout(() => {
            endLoading()
        }, 500);
    })

    }   
    // 重置
    const reset=(start=0,rows=10)=>{
      tableData.length=0;
      (record as any).value='';
      (uploadrecord as any).value='';
    (fkarea.value as any)=0;
     listform.code=''
    listform.name=''
    stdate.value=''
    eddate.value=''
    let params={
        pjid:pjid,
        aid:fkarea.value,
        start:start,
        rows:rows
    }
    
    axios.get('/antmonitor/unit/listdvdt',{params:params}).then(res=>{
      if(res.data.rows){
        res.data.rows.forEach((i:any) => {
          if(i.isexc==false)
          {
            i.isexc='否'
          }else{
            i.isexc='是'
          }
          if(i.isudl==false)
          {
            i.isudl='否'
          }else{
            i.isudl='是'
          }
        });
      }
        total.value=res.data.total;
        res.data.rows.forEach((i:any) => {
          (tableData as any).push(i)
        });
        setTimeout(() => {
            endLoading()
        }, 500);
    })
    }
 

    // 查看监测数据
    // 点击弹出对话框
const table = ref(false)
const dialogFormVisible=ref(false)
    let editForm=ref({
  })
  const formLabelWidth = '140px'
    const check=(id:any)=>{
      timedata.length=0
      antdata.length=0
      table.value=true
      axios.get('/device/api/showdvdata?did='+id+'&wstype='+'WS-1001').then((res:any)=>{
        console.log(res)
        seriesdata=res.data.data
        if(res.data.data){
          res.data.data.forEach((i:any) => {
          timedata.push(i.coldate.substring(2))
          // 随机生成折线图蚂蚁数量
          // i.anum=randomNormal()
          
          // function randomNormal() {
          //   let u = 0, v = 0;
          //   while(u === 0) u = Math.random(); // 排除随机数为0的情况
          //   while(v === 0) v = Math.random();
          //   const num = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(4.0 * Math.PI * v);
          //   if(num>0){
          //     return Math.floor(num);
          //   }else{
          //   return 0
          //   }
          // }
          if(i.anum==null){
            i.anum=0
          }
          antdata.push(i.anum)
        });
        }
        initdataechart()
      })
    }
    const initdataechart=()=>{
      type EChartsOption = echarts.EChartsOption;

      var chartDom = document.getElementById('dataechart')!;
      var myChart = echarts.init(chartDom);
      var option: EChartsOption;

    option = {
      xAxis: {
        type: 'category',
        data: timedata,
        name:'日期',
        axisLabel:{
          interval:0,
          rotate:-30
        }
      },
      yAxis: {
        type: 'value',
        name:'蚂蚁数量/个',

        axisLine:{
          show:true
        }
      },
      series: [
        {
          data: antdata,
          type: 'line',
          smooth: true,
          lineStyle:{
          color:'#d06969',
          },
          itemStyle:{
            color:'#d06969'
          }
        }
      ]
      
    };

    option && myChart.setOption(option);
    window.addEventListener("resize",function(){
        myChart.resize();
    });
    myChart.on('click', function (param) {
        editForm.value=[]
        param.color='red'
        editForm.value=seriesdata[param.dataIndex]
        dialogFormVisible.value=true
            });
        }
    //    删除
    const del=(index:number,id:number)=>{
    // ElMessageBox({}, appContext)
    ElMessageBox.confirm(
    '确定删除此数据?',
    {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }
    )
    .then(() => {
        axios({
        method:'delete',
        url:'/antmonitor/unit/deldvdt?id='+id
    }).then(res=>{
        if(res.data.status==200){
        ElMessage({
            showClose: true,
            message: '删除成功!',
            type: 'success',
        })
        tableData.splice(index,1)
        init()
        }else{
        ElMessage({
            showClose: true,
            message: res.data.msg,
            type: 'error',
        })
        }
    })
    })
    .catch(() => {
        ElMessage({
        showClose: true,
        type: 'info',
        message:'已取消删除',
        })
    })

    }
    // 修改
    const alter=(row:any)=>{
    router.push({path:'/sampleareamanagement/sampleareaalter',query:row})
    }
    // 导出excel表
    const exportClick = () => {
          // 设置当前日期
          let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      let name = year + "" + month + "" + day;
                /** column数据的说明 */
          //1.title为column的标题
          //2.key为column对应的key
          //3.type默认是text，若为图片格式type为image , 并且可以设置图片的宽高
          let column = [
    {
      title: '防控区名称', 
      key: 'aname',
      type: 'text'
    },
        {
      title: '样区名称', 
      key: 'pdname',
      type: 'text'
    },
        {
      title: '监测日期', 
      key: 'acttime',
      type: 'text'
    }, {
      title: '装置编号', 
      key: 'dvorn',
      type: 'text'
    },
        {
      title: '工作人员', 
          key: 'cuser',
          type: 'text'
        }, {
          title: '疫情等级', 
          key:'grade' ,
          type: 'text'
        },
        {
          title: '异常记录',
          key: 'isexc',
          type: 'text',
        }, {
          title: '是否已上传',
          key: 'isudl',
          type: 'text',
        }
      ]
        table2excel(column,tableData, name)    //生成Excel表格，自动下载
    }
  </script>
  
  <style scoped>
    .demo-pagination-block {
    margin-top: 10px;
    height: 30px;
    width:100%;
  }
  .demo-form-inline{
      justify-content:space-between;
      margin-top:20px;
  }
  </style>
  <style lang="less" scoped>
  /deep/ .el-table__inner-wrapper::before{
    width:0
  }
  .el-button--text {
  margin-right: 15px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
/deep/ .el-table .el-table__cell{
  z-index: 0;
}
/deep/ .el-table  .warning-row {
    background-color: rgb(233, 165, 165)!important;
    }
    // 点击表格行 保持高亮
    /deep/ .el-table__body tr.current-row>td.el-table__cell{
  background-color: rgb(150, 199, 230)!important;

}
  </style>
  
