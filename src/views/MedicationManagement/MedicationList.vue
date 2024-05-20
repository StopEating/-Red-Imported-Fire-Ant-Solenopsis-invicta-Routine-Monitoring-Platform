<template>
    <div class="list">
        <!-- 查询/重置/新增 -->
      <el-form :inline="true" :model="listform" class="demo-form-inline" size="small" style="margin-left:2%;">
        <el-form-item>
        <el-input v-model="listform.name" placeholder="输入品牌关键字查询" clearable/>
      </el-form-item>
      <el-form-item >
        <el-input v-model="listform.medical" placeholder="输入药品关键字查询" clearable/>
      </el-form-item>
      <el-form-item>
      <el-select v-model="listform.able" placeholder="药品有无效" style="width:100px">
        <el-option label="有效" value="true" />
        <el-option label="无效" value="false" />
      </el-select>
    </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="check">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" @click="addVisible = true"><el-icon style="vertical-align: middle;"><CirclePlus /></el-icon><span style="vertical-align: middle"> 新增 </span></el-button>
      </el-form-item>
    </el-form>

     <!-- 新增药品 -->
     <el-dialog v-model="addVisible" title="新增药品" style="width:40%" draggable>
            <el-form :model="newform" :rules="newrules" ref="ruleFormRef">
            <el-form-item prop="newpcname" label="药品名称" :label-width="formLabelWidth">
                <el-input v-model="newform.newpcname" autocomplete="off" style="width:300px" required/>
            </el-form-item>
            <el-form-item prop="newpdname" label="品牌" :label-width="formLabelWidth">
                <el-input v-model="newform.newpdname" autocomplete="off" type="tel" style="width:300px"/>
            </el-form-item>
            <el-form-item prop="newcpname" label="厂家" :label-width="formLabelWidth">
                <el-input v-model="newform.newcpname" autocomplete="off" type="tel" style="width:300px"/>
            </el-form-item><el-form-item prop="newptype" label="剂型" :label-width="formLabelWidth">
                <el-select v-model="newform.newptype" class="m-2" placeholder="请选择">
                    <el-option
                    v-for="item in Dosageform"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                    />
                </el-select>
            </el-form-item>
            </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="canceladd(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="addmenber(ruleFormRef)">
          确定
        </el-button>
      </span>
    </template>
     </el-dialog>
     <!-- -------- --> 

    <!-- 成员列表 -->
    <el-table :data="tableData" style="width:90%;text-align:left;margin:5px auto!important;margin-left:2%!important;z-index:inherit;">
      <el-table-column prop="pdname" label="品牌" width="150" />
      <el-table-column prop="pcname" label="药品名称" width="150" />
      <el-table-column prop="ptype" label="剂型" width="120" />
      <el-table-column prop="cpname" label="厂家" width="180" />
      <el-table-column prop="pstatus" label="状态" width="150">
      <template #default="scope">
        <el-switch :value="scope.row.pstatus" disabled active-text="有效"
    inactive-text="无效"/>
        </template>
    </el-table-column>
      <el-table-column prop="cuser" label="添加人" width="150" />
      <el-table-column prop="adddate" label="添加日期" width="150" />

      <el-table-column label="管理功能" width="150" style="text-align:center">
        <template #default="scope">
            <!-- @click="modifyitem(scope.row.id)"  -->
            <el-button size="small" @click="modify(scope.$index, scope.row)" style="margin-right:10px">修改</el-button>

            <el-button size="small" type="danger" @click="del(scope.$index,scope.row.id,scope.row.pcname)">删除</el-button>
           
        </template>
      </el-table-column>
  
    </el-table>
      <!-- 修改信息对话框 -->
      <el-dialog v-model="dialogFormVisible" title="修改药品信息" style="width:40%" draggable destroy-on-close>
                <el-form :model="editForm">
                <el-form-item label="药品名称" :label-width="formLabelWidth">
                    <el-input v-model="editForm.pcname" autocomplete="off" style="width:300px"/>
                </el-form-item>
                <el-form-item label="品牌" :label-width="formLabelWidth">
                    <el-input v-model="editForm.pdname" autocomplete="off" style="width:300px"/>
                </el-form-item>
                <el-form-item label="厂家" :label-width="formLabelWidth">
                    <el-input v-model="editForm.cpname" autocomplete="off" style="width:300px"/>
                </el-form-item>
                <el-form-item label="剂型" :label-width="formLabelWidth">
                    <el-select v-model="editForm.ptype" class="m-2" placeholder="请选择">
                    <el-option
                    v-for="item in Dosageform"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                    />
                </el-select>
                </el-form-item>
                <el-form-item label="是否有效" :label-width="formLabelWidth">
                    <el-switch v-model="editForm.pstatus"/>
                </el-form-item>
                </el-form>
                <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="modifyitem(editForm.pcname,editForm.pdname,editForm.cpname,editForm.ptype,editForm.pstatus,editForm.id)">
                    确定
                    </el-button>
                </span>
                </template>
            </el-dialog>
            <!-- ------------- -->
    <!-- -------- -->
    
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
    <!-- -------- -->

    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineComponent,reactive,ref,onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import axios from 'axios'
  import {startLoading,endLoading} from '@/untils/loading'
  import { ElMessage,ElMessageBox} from 'element-plus';
  import type { FormInstance, FormRules } from 'element-plus'
  const editForm=reactive({
    pcname:'',
    pdname:'',
    cpname:'',
    ptype:'',
    pstatus:'',
    id:''
  })
  const currentPage = ref(1)
  const small = ref(false)
  const background = ref(false)
  const disabled = ref(false)
  const total=ref()
    const store=useStore()
    const router=useRouter()
    let type=store.state.user.type
     const tableData=ref([])
     let uid=store.state.user.uid
// 剂型
const Dosageform=[{
    label:'未知',
    value:0
},{
    label:'饵剂',
    value:1
},{
    label:'粉剂',
    value:2
},{
    label:'乳油',
    value:3
},{
    label:'可湿性饵剂',
    value:4
}
]
// 查询/重置字段
const listform= reactive({
name: '',
medical: '',
able:"true"
})

// 点击修改弹出对话框
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
// 修改
const modifyitem=(pcname:string,pdname:string,cpname:string,ptype:any,pstatus:any,id:any)=>{
    if(pstatus){
        pstatus=1
    }else{
        pstatus=0
    }
      axios.post('/antmonitor/unit/udpsi?pcname='+pcname+'&pdname='+pdname+'&cpname='+cpname+'&ptype='+ptype+'&pstatus='+pstatus+'&id='+id).then(res=>{
    if(res.data.status==200){
        ElMessage({
                  showClose: true,
                  message: '修改成功!',
                  type: 'success',
         })
        dialogFormVisible.value=false
        init()
        }else{
            ElMessage({
                    showClose: true,
                    message: res.data.msg,
                    type: 'error',
            })
        }
    })
}
    const modify=(index:any,row:any)=>{
      let obj=Object.assign({},row)
      editForm.cpname=obj.cpname
      editForm.pcname=obj.pcname
      editForm.pdname=obj.pdname
      editForm.ptype=obj.ptype
      editForm.id=obj.id
      editForm.pstatus=obj.pstatus
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
  // 新增药品
  const addVisible=ref(false)
  // 新增药品form
  const newform=reactive({
      newpcname:'',
      newpdname:'',
      newcpname:'',
      newptype:'',
  })
  const ruleFormRef = ref<FormInstance>()
  // 新增药品form规则
  const newrules = reactive<FormRules>({
      newpcname: [
      { required: true, message: '请输入药品名称', trigger: 'blur' },
    ],
    newpdname: [
      {
        required: true,
        message: '请输入药品品牌',
        trigger: 'blur',
      }], 
      newcpname: [
      {
        required: true,
        message: '请输入厂家名称',
        trigger: 'blur',
      }], 
      newptype: [
      {
        required: true,
        message: '请选择药剂剂型',
        trigger: 'blur',
      }],
    })
  //   新增药品
  const addmenber = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
  if (valid) {
      axios.post('/antmonitor/unit/addpsi?cphone='+store.state.user.phone+'&cuser='+store.state.user.username+'&uid='+store.state.user.uid+'&pcname='+newform.newpcname+'&pdname='+newform.newpdname+'&cpname='+newform.newcpname+'&ptype='+newform.newptype).then(res=>{
          if(res.data.status==200){
              ElMessage({
                  showClose: true,
                  message: '添加成功!',
                  type: 'success',
              })
              addVisible.value=false
              init()
              formEl.resetFields()
          }
          })
          } else {
              ElMessage({
                      showClose: true,
                      message: '添加失败!',
                      type: 'error',
              })
          }
  })
  }
  // 取消新增
  const canceladd=(formEl: FormInstance | undefined) => {
    if (!formEl) return
    ElMessage({
                  showClose: true,
                  type: 'info',
                  message:'已取消新增',
                })
    formEl.resetFields()
    addVisible.value=false
  }

  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
  }
  const handleCurrentChange = (val: number) => {
    init((val-1)*10)
  }


        //  初始化
        const init=(start=0,rows=10)=>{
          startLoading()
          let pcname=listform.medical
          let pdname=listform.name
          let pstatus=listform.able
          axios.get('/antmonitor/unit/listpsi?uid='+uid+'&pcname='+pcname+'&pdname='+pdname+'&pstatus='+pstatus+'&start='+start+'&rows='+rows).then(res=>{
            console.log(res)
            res.data.rows.forEach((e:any )=> {
                if(e.ptype==='1'){
                    e.ptype='饵剂'
                }else if(e.ptype=='2'){
                    e.ptype='粉剂'
                }else if(e.ptype=='3'){
                    e.ptype='乳油'
                }else if(e.ptype=='4'){
                    e.ptype='可湿性饵剂'
                }
                if(e.pstatus=='1'){
                    e.pstatus=true
                }else if(e.pstatus=='0'){
                    e.pstatus=false
                }
            });
            total.value=res.data.total
            tableData.value=res.data.rows
            setTimeout(() => {
              endLoading()
            }, 500);
          })
        }
        init()

          //    删除
          const del=(index:number,id:number,pcname:string)=>{
            console.log(pcname)
            // ElMessageBox({}, appContext)
            ElMessageBox.confirm(
            '确定删除此药品?',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
            .then(() => {
              axios({
              method:'delete',
              url:'/antmonitor/unit/delpsi?id='+id+'&pcname='+pcname
            }).then(res=>{
              console.log(res)
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
          const check=()=>{
            init()
        }
        // 重置
        const reset=()=>{
          listform.able="true"
          listform.medical=''
          listform.name=''
          init()
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
  z-index: 0!important;
  position: inherit;
}
  </style>
  