<template>
    <div class="list">
        <!-- 查询/重置/新增 -->
      <el-form :inline="true" :model="listform" class="demo-form-inline" size="small" style="margin-left:2%;">
        <el-form-item>
        <el-input v-model="listform.name" placeholder="输入姓名关键字查询" clearable/>
      </el-form-item>
      <el-form-item >
        <el-input v-model="listform.phone" placeholder="输入手机号关键字查询" min="1" maxlength="10" clearable type="number"/>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="check">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" @click="addVisible = true"><el-icon style="vertical-align: middle;"><CirclePlus /></el-icon><span style="vertical-align: middle"> 新增 </span></el-button>
         
      </el-form-item>
    </el-form>
     <!-- 新增成员 -->
     <el-dialog v-model="addVisible" title="新增成员" style="width:40%" draggable>
            <el-form :model="newform" :rules="newrules" ref="ruleFormRef">
            <el-form-item prop="newusername" label="成员姓名" :label-width="formLabelWidth">
                <el-input v-model="newform.newusername" autocomplete="off" style="width:300px" required/>
            </el-form-item>
            <el-form-item prop="newphone" label="成员手机" :label-width="formLabelWidth">
                <el-input v-model="newform.newphone" autocomplete="off" type="tel" style="width:300px"/>
            </el-form-item>
            <el-form-item label="是否为管理员" :label-width="formLabelWidth">
                <el-switch  v-model="newform.newisadmin" />
            </el-form-item>
            <el-form-item label="是否有效" :label-width="formLabelWidth">
                <el-switch  v-model="newform.newisable" />
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
    <!-- 成员列表 -->
    <el-table :data="tableData" style="width:90%;text-align:left;margin:5px auto!important;margin-left:2%!important;">
      <!-- <el-table-column prop="alias" label="项目区划" width="100" /> -->
      <el-table-column prop="username" label="姓名" width="150" />
      <el-table-column prop="phone" label="手机号" width="150" />
      <el-table-column label="管理员" width="150" >
        <template #default="scope">
        <el-switch :value="scope.row.isadmin" disabled />
        </template>
      </el-table-column>
      <el-table-column label="有效" width="150" >
        <template #default="scope">
        <el-switch :value="scope.row.isable" disabled />
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="创建日期" width="150" />
      <el-table-column label="管理功能" width="150" style="text-align:center">
        <template #default="scope">
            <!-- @click="modifyitem(scope.row.id)"  -->
            <el-button size="small" @click="modify(scope.$index,scope.row)" style="margin-right:10px">修改</el-button>
         
            <el-button size="small" type="danger" @click="del(scope.$index,scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
  
    </el-table>
   <!-- 修改信息对话框 -->
   <el-dialog v-model="dialogFormVisible" title="修改成员信息" style="width:40%" draggable>
    <el-form v-model="editForm">
      <el-form-item label="成员姓名" :label-width="formLabelWidth">
        <el-input v-model="editForm.username" autocomplete="off" style="width:300px"/>
      </el-form-item>
      <el-form-item label="成员手机" :label-width="formLabelWidth">
        <el-input v-model="editForm.phone" autocomplete="off" type="tel" style="width:300px"/>
      </el-form-item>
      <el-form-item label="是否为管理员" :label-width="formLabelWidth">
        <el-switch v-model="editForm.isadmin"  />
      </el-form-item>
      <el-form-item label="是否有效" :label-width="formLabelWidth">
        <el-switch v-model="editForm.isable"  />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="modifyitem(editForm.username,editForm.phone,editForm.isadmin,editForm.isable,editForm.id)">
          确定
        </el-button>
      </span>
    </template>
            </el-dialog>
            <!-- ------------- -->
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
  import type { FormInstance, FormRules } from 'element-plus'
import { pa } from 'element-plus/es/locale';
  const editForm=reactive({
    username:'',
    phone:'',
    isadmin:'',
    isable:'',
    id:''
  })
  let oldform=reactive({
    username:'',
    phone:'',
    isadmin:'',
    isable:'',
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
     let phone=store.state.user.phone
    // 点击修改弹出对话框
    const dialogFormVisible = ref(false)
    const modify=(index:any,row:any)=>{
      let obj=Object.assign({},row)
      oldform.id=obj.id
      oldform.username=obj.username
      oldform.phone=obj.phone
      oldform.isable=obj.isable
      oldform.isadmin=obj.isadmin

      editForm.id=obj.id
      editForm.username=obj.username
      editForm.phone=obj.phone
      editForm.isable=obj.isable
      editForm.isadmin=obj.isadmin
      dialogFormVisible.value = true
    }
    const formLabelWidth = '140px'
    // 修改
    const modifyitem=(username:string,phone:string,isadmin:any,isable:any,id:any)=>{
      let result=JSON.stringify((oldform as any))==JSON.stringify((editForm as any))
      if(!result)
      {
        let params='&id='+id
        if(oldform.username!==editForm.username)
        {
          params=params+'&username='+editForm.username
        }
        if(oldform.phone!==editForm.phone)
        {
          params=params+'&phone='+editForm.phone
        }
        if(oldform.isadmin!==editForm.isadmin)
        {
          params=params+'&isadmin='+editForm.isadmin
        }
        if(oldform.isable!==editForm.isable)
        {
          params=params+'&isable='+editForm.isable
        }
            axios.post('/antmonitor/unit/udmen',params).then(res=>{
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
      }else{
        dialogFormVisible.value=false
      }
      
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
    // 新增成员
    const addVisible=ref(false)
    // 新增成员form
    const newform=reactive({
        newusername:'',
        newphone:'',
        newisadmin:false,
        newisable:false
    })
    const ruleFormRef = ref<FormInstance>()
    // 新增成员form规则
    const newrules = reactive<FormRules>({
        newusername: [
        { required: true, message: '请输入成员名称', trigger: 'blur' },
      ],
      newphone: [
        {
          required: true,
          message: '请输入成员手机号',
          trigger: 'blur',
        }],
      })
    //   新增成员
    const addmenber = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
    if (valid) {
        axios.post('/antmonitor/unit/addmen?uphone='+store.state.user.phone+'&uid='+store.state.user.uid+'&uname='+store.state.user.uname+'&username='+newform.newusername+'&phone='+newform.newphone+'&isadmin='+newform.newisadmin+'&isable='+newform.newisable).then(res=>{
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
   
     const listform= reactive({
          name: '',
          phone: '',
          })
     
        //  初始化
        const init=(start=0,rows=10)=>{
          startLoading()
          // listform内容不为空时可起查询作用
          let uname=listform.name
          let uphone=listform.phone
          axios.get('/antmonitor/unit/listmen?phone='+phone+'&uphone='+uphone+'&username='+uname+'&start='+start+'&rows='+rows).then(res=>{
            total.value=res.data.total
            tableData.value=res.data.rows
            setTimeout(() => {
              endLoading()
            }, 500);
          })
        }
        init()
        //    删除
        const del=(index:number,id:number)=>{
          // ElMessageBox({}, appContext)
          ElMessageBox.confirm(
          '确定删除此成员?',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            axios({
            method:'delete',
            url:'/antmonitor/unit/delmen?id='+id
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
        // 查询
        const check=()=>{
          init()
        }
        // 重置
        const reset=()=>{
          listform.name=''
          listform.phone=''
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
  z-index: 0;
}
  </style>
  