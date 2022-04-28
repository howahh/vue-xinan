<template>
  <a-row>
    <a-col><a-table :dataSource="dataSource" :columns="columns" /></a-col>
  </a-row>
</template>

<script>
export default {
  name:"AnalyzeJob",

   setup() {
        let dataSource= [
         {
           key: '1',
           name: '胡彦斌',
           age: 32,
           address: '西湖区湖底公园1号',
         },
         {
           key: '2',
           name: '胡彦祖',
           age: 42,
           address: '西湖区湖底公园1号',
         },
       ];

     let  columns= [
         {
           title: '姓名',
           dataIndex: 'name',
           key: 'name',
         },
         {
           title: '年龄',
           dataIndex: 'age',
           key: 'age',
         },
         {
           title: '住址',
           dataIndex: 'address',
           key: 'address',
           width:"200px",
         },
         {
           title: 'id',
           dataIndex: 'key',
           key: 'key',
         },
       ];
     return {
       dataSource,
       columns,
     };
   },
 };
</script>

<style></style>
