import { createRouter, createWebHistory,createWebHashHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component:LoginView
  },{
    path: '/index',
    name: 'index',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/IndexCon.vue'),
    children:[
      // 数据可视化
      {
        path: '/datavisualization/overview',
        name: '总览',
        component: () => import(/* webpackChunkName: "about" */ '../views/DataVisualization/OverView.vue')
      },{
        path: '/datavisualization/samplearea',
        name: '样区',
        component: () => import(/* webpackChunkName: "about" */ '../views/DataVisualization/SampleArea.vue')
      },
      // 个人中心
      {
        path: '/personalcenter/changepwd',
        name: '修改密码',
        component: () => import(/* webpackChunkName: "about" */ '../views/PersonalCenter/ChangePwd.vue')
      },
      // 人员管理
      {
        path: '/personnelmanagement/membetlist',
        name: '成员列表',
        component: () => import(/* webpackChunkName: "about" */ '../views/PersonnelManagement/MemberList.vue')
      },
      // 防控用药
      {
        path: '/medicationmanagement/medicationlist',
        name: '防控用药',
        component: () => import(/* webpackChunkName: "about" */ '../views/MedicationManagement/MedicationList.vue')
      },
      // 防控区管理
      {
        path: '/prectrlmanagement/prectrllist',
        name: '防控区列表',
        component: () => import(/* webpackChunkName: "about" */ '../views/PreCtrlManagement/PreCtrlList.vue')
      }, {
        path: '/prectrlmanagement/prectrladd',
        name: '防控区增加',
        component: () => import(/* webpackChunkName: "about" */ '../views/PreCtrlManagement/PreCtrlAdd.vue')
      },{
        path: '/prectrlmanagement/prectrlnormaladd',
        name: '防控区普通地图增加',
        component: () => import(/* webpackChunkName: "about" */ '../views/PreCtrlManagement/PreCtrlNormalAdd.vue')
      },{
        path: '/prectrlmanagement/prectrlalter',
        name: '防控区修改',
        component: () => import(/* webpackChunkName: "about" */ '../views/PreCtrlManagement/PreCtrlAlter.vue')
      },{
        path: '/prectrlmanagement/prectrlnormalalter',
        name: '防控区普通地图修改',
        component: () => import(/* webpackChunkName: "about" */ '../views/PreCtrlManagement/PreCtrlNormalAlter.vue')
      },
      {
        path: '/sampleareamanagement/samplearealist',
        name: '样区列表',
        component: () => import(/* webpackChunkName: "about" */ '../views/SampleAreaManagement/SampleAreaList.vue')
      },
      {
        path: '/sampleareamanagement/sampleareaadd',
        name: '样区新增',
        component: () => import(/* webpackChunkName: "about" */ '../views/SampleAreaManagement/SampleAreaAdd.vue')
      },
      {
        path: '/sampleareamanagement/samplenormaladd',
        name: '样区普通地图新增',
        component: () => import(/* webpackChunkName: "about" */ '../views/SampleAreaManagement/SampleNormalAdd.vue')
      },
      {
        path: '/sampleareamanagement/sampleareaalter',
        name: '样区修改',
        component: () => import(/* webpackChunkName: "about" */ '../views/SampleAreaManagement/SampleAreaAlter.vue')
      },
      {
        path: '/sampleareamanagement/sampleareanormalalter',
        name: '样区普通地图修改',
        component: () => import(/* webpackChunkName: "about" */ '../views/SampleAreaManagement/SampleAreaNormalAlter.vue')
      },
      {
        path: '/monitoringdatamanagement/monidatamanagement',
        name: '监测数据管理',
        component: () => import(/* webpackChunkName: "about" */ '../views/MonitoringDataManagement/MoniDataManagement.vue')
      },
      {
        path: '/antnestdata/nestdatalist',
        name: '蚁巢数据',
        component: () => import(/* webpackChunkName: "about" */ '../views/AntNestData/NestDataList.vue')
      },
      {
        path:'/preventctrldata/preventctrllist',
        name: '防控数据',
        component: () => import(/* webpackChunkName: "about" */ '../views/PreventCtrlData/PreventCtrlList.vue')
      },
      {
        path:'/databoard/prectrleffect',
        name: '防控成效',
        component: () => import(/* webpackChunkName: "about" */ '../views/DataBoard/PreCtrlEffect.vue')
      },
      {
        path:'/statisticalchart/monitstatistics',
        name: '监测统计表',
        component: () => import(/* webpackChunkName: "about" */ '../views/StatisticalChart/MonitStatistics.vue')
      },
      {
        path:'/statisticalchart/monitcycle',
        name: '监测周期图',
        component: () => import(/* webpackChunkName: "about" */ '../views/StatisticalChart/MonitCycle.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
