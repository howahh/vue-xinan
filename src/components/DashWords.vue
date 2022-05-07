<template>
  <div class="words">
      <div v-for="item in title" :key="item">
          <div >{{item}}<a-divider/></div>
          
      </div>
  </div>
</template>

<script>
import {onMounted,ref,reactive} from 'vue'
import { inject } from "vue";
export default {
    name: 'DashWord',
    setup(){
    let $echarts = inject("echarts");
    let $axios = inject("axios");
    let title = reactive([])
    let url = reactive([])

    onMounted(()=>{
        getData()
    })
    async function getData(){
            await $axios
            .post("http://localhost:5000/apiRequestSender/query/QASystem",{
                param:"长津湖哪些网站有"
            })
            .then(function (response){
                console.log(response)
                // title = response.data.data.map(item=>{
                //     return item.title
                // })
                // url  = response.data.data.map(item=>{
                //     return item.url
                // })
                // for(var i in response.data.data){
                //     title.push(response.data.data[i].title)
                //     url.push(response.data.data[i].url)
                // }
                // console.log(title,url)
            })
        }
    return{getData,title,url}
    }
}
</script>

<style>
.words{
    height: 267px;
    color: white;
    font-style:white
}
</style>
