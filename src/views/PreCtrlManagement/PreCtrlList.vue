<template>
    <div class="list">
        <!-- 查询/重置/新增 -->
      <el-form :inline="true" :model="listform" class="demo-form-inline" size="small" style="margin-left:2%;">
        <el-form-item>
        <el-input v-model="listform.name" placeholder="输入防控区名称关键字查询" />
      </el-form-item>
     
      <el-form-item>
          <el-button type="primary" @click="init()">查询</el-button>
          <el-button type="primary"  @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 成员列表 -->
    <el-table :data="tableData" style="width:90%;text-align:left;margin:5px auto!important;margin-left:2%!important;">
      <!-- <el-table-column prop="alias" label="项目区划" width="100" /> -->
      <el-table-column prop="aname" label="防控区名称" width="200" />
      <el-table-column prop="carea" label="面积/亩" width="200" />
      <el-table-column prop="createdate" label="创建日期" width="200" />
      <el-table-column label="管理功能" width="300" style="text-align:center">
        <template #default="scope">
            <!-- @click="modifyitem(scope.row.id)"  -->
            <el-button size="small"  style="margin-right:10px" @click="modify(scope.$index,scope.row)">部分修改</el-button>
            <el-button size="small"  style="margin-right:10px" @click="alter(scope.row)">整体修改</el-button>
            <el-button size="small" type="danger" @click="del(scope.$index,scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
  
    </el-table>
<!-- 修改信息对话框 -->
<el-dialog v-model="dialogFormVisible" title="修改成员信息" style="width:40%" draggable>
    <el-form v-model="editForm">
      <el-form-item label="防控区名称" :label-width="formLabelWidth">
        <el-input v-model="editForm.aname" autocomplete="off" style="width:300px"/>
      </el-form-item>
      <el-form-item label="生境" :label-width="formLabelWidth">
        <el-select v-model="editForm.sgtype" class="m-2" placeholder="Select">
    <el-option
      v-for="item in habitats"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">
          确定
        </el-button>
      </span>
    </template>
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
  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
  }
  const handleCurrentChange = (val: number) => {
    init((val-1)*10)
  }
  const editForm=reactive({
    id:'',
    aname:'',
    sgtype:'',
  })
  let oldform=reactive({
    id:'',
    aname:'',
    sgtype:'',
  })
  const habitats=[{label:'全部',value:0},{label:'公园',value:1},{label:'景区',value:2},{label:'广场',value:3},{label:'园区',value:4},{label:'厂区',value:5},{label:'学校',value:6},{label:'村庄',value:7},{label:'社区',value:8},{label:'种养基地',value:9},{label:'企事单位',value:10}]
  const formLabelWidth = '140px'
   // 点击修改弹出对话框
   const dialogFormVisible = ref(false)
  //  修改部分信息
  const modify=(index:any,row:any)=>{
      let obj=Object.assign({},row)
      oldform.id=obj.id
      oldform.aname=obj.aname
      oldform.sgtype=obj.sgtype
  
      editForm.id=obj.id
      editForm.aname=obj.aname
      editForm.sgtype=obj.sgtype
      dialogFormVisible.value = true
    }
      // 取消修改
    const cancel=()=>{
      ElMessage({
                  showClose: true,
                  type: 'info',
                  message:'已取消修改',
                })
                dialogFormVisible.value=false
                init()
  }
    // 保存防控区名称以及生境修改
    // 调用接口
    const save=()=>{
        axios.post('/antmonitor/unit/udpja?id='+editForm.id+'&aname='+editForm.aname+'&sgtype='+editForm.sgtype).then(res=>{
          ElMessage({
          message: '管理防控区成功！',
          type: 'success',
        })
        dialogFormVisible.value=false
                init()
      })

      }
  const currentPage = ref(1)
  const small = ref(false)
  const background = ref(false)
  const disabled = ref(false)
  const total=ref()
    const store=useStore()
    const router=useRouter()
    let type=store.state.user.type
     const tableData=ref([])
     let pjid=store.state.user.pjid
     const listform= reactive({
          name: '',
          phone: '',
          })
     startLoading()
        //  初始化
        const init=(start=0,rows=10)=>{
          let params={
            pjid:pjid,
            start:start,
            rows:rows,
            aname:listform.name
          }
          axios.get('/antmonitor/unit/listpja',{params:params}).then(res=>{
            total.value=res.data.total
            tableData.value=res.data.rows
            setTimeout(() => {
              endLoading()
            }, 500);
          })
        }
        init()
        // 重置
        const reset=(start=0,rows=10)=>{
          listform.name=''
          let params={
            pjid:pjid,
            start:start,
            rows:rows,
            aname:''
          }
          axios.get('/antmonitor/unit/listpja',{params:params}).then(res=>{
            total.value=res.data.total
            tableData.value=res.data.rows
            setTimeout(() => {
              endLoading()
            }, 500);
          })
        }
       
          //    删除
          const del=(index:number,id:number)=>{
            // ElMessageBox({}, appContext)
            ElMessageBox.confirm(
            '确定删除此防控区?',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
            .then(() => {
              axios({
              method:'delete',
              url:'/antmonitor/unit/delpja?id='+id
            }).then(res=>{
              if(res.data.status==200){
                ElMessage({
                  showClose: true,
                  message: '删除成功!',
                  type: 'success',
                })
                tableData.value.splice(index,1)
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
        router.push({path:'/prectrlmanagement/prectrlalter',query:row})
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
  </style>
  