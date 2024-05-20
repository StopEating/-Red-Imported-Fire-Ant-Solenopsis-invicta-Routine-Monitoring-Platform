<template>
    <div class="list">
        <!-- 查询/重置/新增 -->
      <el-form :inline="true"  class="demo-form-inline" size="small" style="margin-left:2%;">
       <el-form-item>
        <el-select v-model="fkarea" class="m-2" placeholder="Select" @change="inityq">
        <el-option
        v-for="item in fklist"
        :key="(item as any).aid"
        :label="(item as any).aname"
        :value="(item as any).aid"
        />
        </el-select>
       </el-form-item>
       <el-form-item>
        <el-select v-model="yqarea" class="m-2" placeholder="Select" >
        <el-option
        v-for="item in yqlist"
        :key="(item as any).pid"
        :label="(item as any).pdname"
        :value="(item as any).pid"
        />
        </el-select>
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
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="init()">查询</el-button>
          <el-button type="primary" @click="reset()">重置</el-button>
          <el-button type="primary" @click="exportClick()">数据导出</el-button>
      </el-form-item>
     
    </el-form>
    <!-- 成员列表 -->
    <el-table :data="tableData" style="width:90%;text-align:left;margin:5px auto!important;margin-left:2%!important;">
      <el-table-column prop="aname" label="防控区名称" width="180" />
      <el-table-column prop="pdname" label="样区名称" width="180" />
      <el-table-column prop="acttime" label="防控日期" width="180" />
      <el-table-column prop="cuser" label="工作人员" width="100" />
      <el-table-column prop="ftype" label="防控类型" width="100" />
      <el-table-column  label="防控图片" width="150" >
        <template #default="scope">
          <template v-if="scope.row.imgurl.includes(';')">
            <el-image
      style="width: 100px; height: 100px"
      :src="scope.row.imgurl.split(';')[0]"
      :zoom-rate="1.2"
      :preview-src-list="scope.row.imgurl.split(';')"
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
          </template>
          <template v-else>
            <el-image
      style="width: 100px; height: 100px"
      :src="scope.row.imgurl"
      :zoom-rate="1.2"
      :preview-src-list="[scope.row.imgurl]"
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
          </template>
        </template>
      </el-table-column>
      <el-table-column label="管理功能" width="200" style="text-align:center">
        <template #default="scope">
            <!-- @click="modifyitem(scope.row.id)"  -->
          
            <el-button size="small" type="danger" @click="del(scope.$index,scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
  
    </el-table>

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
  import table2excel from 'js-table2excel';
    let stdate=ref('')
    let eddate=ref('')
    const records=[{label:'全部',value:0},{label:'蚁巢环施',value:1},{label:'区域撒播',value:2}]
    let record=ref(0)
    const fklist=ref('')
    let fkarea=ref('')
    let yqlist=ref('')
    let yqarea=ref('')
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
    const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
    }
    const handleCurrentChange = (val: number) => {
    init((val-1)*10)
    }
    const inityq=()=>{
      if((fkarea.value as any)==0){
      (yqlist.value as any)=[{pid:0,pdname:'全部样区'}];
      (yqarea.value as any)=0
      init()
    }else{
      axios.get('/antmonitor/unit/pdts?aid='+fkarea.value).then(res=>{
        (yqlist.value as any)=[];
    res.data.data.unshift({pid:0,pdname:'全部样区'})
    yqlist.value=res.data.data;
    (yqarea.value as any)=0
    init()
    })
    }
    }
    startLoading()
    //  初始化
    axios.get('/antmonitor/unit/pjas?pjid='+pjid).then(res=>{
    res.data.data.unshift({aid:0,aname:'全部防控区'})
    fklist.value=res.data.data;
    (fkarea.value as any)=0;
    (yqlist.value as any)=[{pid:0,pdname:'全部样区'}];
    (yqarea.value as any)=0
    init()
    })
    const init=(start=0,rows=10)=>{
    let params={
        pjid:pjid,
        aid:fkarea.value,
        pid:yqarea.value,
        ftype:record.value,
        stdate:stdate.value,
        eddate:eddate.value,
        start:0,
        rows:10
    }
    axios.get('/antmonitor/unit/listfkdt',{params:params}).then(res=>{
      if(res.data.rows){
        res.data.rows.forEach((i:any) => {
          if(i.ftype==1)
          {
            i.ftype='蚁巢环施'
          }else{
            i.ftype='区域撒播'
          }
        });
      }
        total.value=res.data.total;
        tableData=res.data.rows
        setTimeout(() => {
            endLoading()
        }, 500);
    })
    }  
    //重置
    const reset=(start=0,rows=10)=>{
      (fkarea.value as any)=0;
      (yqarea.value as any)=0
      record.value=0
      stdate.value=''
      eddate.value=''
      let params={
        pjid:pjid,
        aid:0,
        pid:0,
        ftype:0,
        start:0,
        rows:10
    }
    axios.get('/antmonitor/unit/listfkdt',{params:params}).then(res=>{
      if(res.data.rows){
        res.data.rows.forEach((i:any) => {
          if(i.ftype==1)
          {
            i.ftype='蚁巢环施'
          }else{
            i.ftype='区域撒播'
          }
        });
      }
        total.value=res.data.total;
        tableData=res.data.rows
        setTimeout(() => {
            endLoading()
        }, 500);
    })
    } 
    // const listform= reactive({
    // name: '',
    // code: '',
    // })
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
        url:'/antmonitor/unit/delfkdt?id='+id
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
   title: '防控日期', 
   key: 'acttime',
   type: 'text'
 },
     {
   title: '工作人员', 
      key: 'cuser',
      type: 'text'
    }, {
      title: '防控类型', 
      key:'ftype' ,
      type: 'text'
    },
    {
      title: '防控图片',
      key: 'imgurl',
      type: 'text',
    },
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
  position: inherit;
}
  </style>
  
