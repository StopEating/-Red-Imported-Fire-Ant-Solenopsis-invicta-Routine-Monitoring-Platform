<template>
  <div style="display:flex;justify-content: space-around;">
      <!-- 查询/重置/新增 -->
      <el-form :inline="true"  class="demo-form-inline" size="small" style="margin-left:2%;">
       <el-form-item>
        防控区：<el-select v-model="fkarea" class="m-2" placeholder="选择防控区">
        <el-option
        v-for="item in fklist"
        :key="(item as any).aid"
        :label="(item as any).aname"
        :value="(item as any).aid"
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
          <!-- <el-button type="primary" @click="exportClick()">数据导出</el-button> -->
      </el-form-item>
     
    </el-form>
 
  </div>
  <div style="width:90%">
    <el-table border style="margin-top: 50px;margin-left:50px" :data="tableData">
            <el-table-column v-for="(item, index) in toptitle" :label="item" :key="index" align="center">
              <template v-slot="scope">
                    {{scope.row[index]}}
                </template>
            </el-table-column>
        </el-table>
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
    let tableData:any=ref([])
    let pjid=store.state.user.pjid
    let aid:any
    let grade:any
    let toptitle:any=reactive([])
    let lefttitle=['监测点数量','蚁巢点','蚁情等级']
    let yqlist:any=reactive([])
    let newdata:any=reactive([])

    //  初始化
      axios.get('/antmonitor/unit/pjas?pjid='+pjid).then(res=>{
    fklist.value=res.data.data;
    (fkarea.value as any)=res.data.data[0].aid;
    aid=res.data.data[0].aid;
    init()
    })

    const init=()=>{
 startLoading()
    let params={
        pjid:pjid,
        aid:fkarea.value,
        stdate:stdate.value,
        eddate:eddate.value,
    }
    axios.get('/antmonitor/visual/anaexcel',{params:params}).then(res=>{
      console.log(res)
      yqlist=[]
      toptitle=[]
      newdata=[]
        total.value=res.data.total;
       res.data.data.forEach((i:any) => {
        yqlist.push(i.pdname)
        i.datas.forEach((e:any) => {
          toptitle.push(e.curym)
          newdata.push([e.surnum,e.ycnum,e.grade]) 
        });
       });
       toptitle.unshift('样区名称','统计项')
          // 数组按矩阵思路, 变成转置矩阵
          let matrixData = newdata.map((row:any) => {
                let arr:any = []
                for (let key in row) {
                    arr.push(row[key])
                }
                return arr
            })
            // 加入标题拼接最终的数据
            newdata = matrixData[0].map((col:any, i:any) => {
                return [yqlist[i],lefttitle[i], ...matrixData.map((row:any) => {
                    return row[i]
                })]
            })
            tableData.value=newdata
        setTimeout(() => {
            endLoading()
        }, 500);
    })
    } 
    const reset=()=>{
      let params={
        pjid:pjid,
        aid:aid,
        stdate:'',
        eddate:'',
    }
    fkarea.value=aid
    axios.get('/antmonitor/visual/anaexcel',{params:params}).then(res=>{
      yqlist=[]
      toptitle=[]
      newdata=[]
        total.value=res.data.total;
       res.data.data.forEach((i:any) => {
        yqlist.push(i.pdname)
        i.datas.forEach((e:any) => {
          toptitle.push(e.curym)
          newdata.push([e.surnum,e.ycnum,e.grade]) 
        });
       });
       toptitle.unshift('样区名称','统计项')
          // 数组按矩阵思路, 变成转置矩阵
          let matrixData = newdata.map((row:any) => {
                let arr:any = []
                for (let key in row) {
                    arr.push(row[key])
                }
                return arr
            })
            // 加入标题拼接最终的数据
            newdata = matrixData[0].map((col:any, i:any) => {
                return [yqlist[i],lefttitle[i], ...matrixData.map((row:any) => {
                    return row[i]
                })]
            })
            tableData.value=newdata
        setTimeout(() => {
            endLoading()
        }, 500);
    })
    }
//     // 表格合并
//     interface User {
//   id: string
//   name: string
//   amount1: string
//   amount2: string
//   amount3: number
// }
//   interface SpanMethodProps {
//   row: User
//   column: TableColumnCtx<User>
//   rowIndex: number
//   columnIndex: number
// }

//   const objectSpanMethod = ({
//   row,
//   column,
//   rowIndex,
//   columnIndex,
// }: SpanMethodProps) => {
//   if (columnIndex === 0) {
//     if (rowIndex % 2 === 0) {
//       return {
//         rowspan: 2,
//         colspan: 1,
//       }
//     } else {
//       return {
//         rowspan: 0,
//         colspan: 0,
//       }
//     }
//   }
// }
</script>

<style scoped>

</style>
