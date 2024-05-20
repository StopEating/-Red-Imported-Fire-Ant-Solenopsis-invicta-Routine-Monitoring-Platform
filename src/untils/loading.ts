import { ElLoading} from 'element-plus';
let loadingInstance: any;
 export const startLoading = () => {
loadingInstance = ElLoading.service({
      lock: true,
      text: '正在拼命加载中……',
      background: 'rgba(0, 0, 0, 0.7)'
    });
 };
export function endLoading() {
    loadingInstance.close();
 }