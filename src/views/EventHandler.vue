<template>
  <el-row>
    <el-col :span="7" :offset="1"
      ><div class="chart-content bg-purple">
        <Lines myid="hh" />
      </div>
    </el-col>
    <el-col :span="7" :offset="1"
      ><div class="chart-content bg-purple">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              Card name
              <el-button class="button" type="text">Operation button</el-button>
            </div>
          </template>
          <div v-for="o in 8" :key="o" class="text item">
            {{ "List item " + o }}
          </div>
        </el-card>
      </div></el-col
    >
    <el-col :span="7" :offset="1">
      <div class="chart-content bg-purple">
        <Lines myid="1hh" />
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="16" :offset="1"
      ><div class="table-content bg-purple">
        <div class="table-in">
          <el-table :data="tableData" style="width: 100%" max-height="417" border>
            <el-table-column fixed prop="date" label="日期" width="150" />
            <el-table-column prop="name" label="任务名称" width="120" />
            <el-table-column prop="state" label="任务状态" width="120" />
            <el-table-column prop="city" label="爬虫" width="120" />
            <el-table-column prop="address" label="页面数量" width="120" />
            <el-table-column prop="zip" label="状态" width="120" />
            <el-table-column fixed="right" label="Operations" width="120">
              <template #default="scope">
                <el-button
                  type="text"
                  size="small"
                  @click.prevent="deleteRow(scope.$index)"
                >
                  Remove
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button class="mt-4" style="width: 100%" @click="onAddItem"
            >Add Item</el-button
          >
        </div>
      </div></el-col
    >
    <el-col :span="7"><div class="table-content bg-purple"></div></el-col>
  </el-row>
</template>

<script>
import dayjs from "dayjs";
import { ref } from "vue";
import Lines from "../components/Lines.vue";

export default {
  name: "EventHandler",
  components: {
    Lines,
  },
  setup() {
    const now = new Date();

    const tableData = ref([
      {
        date: "2016-05-01",
        name: "Tom",
        state: "California",
        city: "Los Angeles",
        address: "No. 189, Grove St, Los Angeles",
        zip: "CA 90036",
      },
      {
        date: "2016-05-02",
        name: "Tom",
        state: "California",
        city: "Los Angeles",
        address: "No. 189, Grove St, Los Angeles",
        zip: "CA 90036",
      },
      {
        date: "2016-05-03",
        name: "Tom",
        state: "California",
        city: "Los Angeles",
        address: "No. 189, Grove St, Los Angeles",
        zip: "CA 90036",
      },
            {
        date: "2016-05-03",
        name: "Tom",
        state: "California",
        city: "Los Angeles",
        address: "No. 189, Grove St, Los Angeles",
        zip: "CA 90036",
      },
            {
        date: "2016-05-03",
        name: "Tom",
        state: "California",
        city: "Los Angeles",
        address: "No. 189, Grove St, Los Angeles",
        zip: "CA 90036",
      },
            {
        date: "2016-05-03",
        name: "Tom",
        state: "California",
        city: "Los Angeles",
        address: "No. 189, Grove St, Los Angeles",
        zip: "CA 90036",
      },
            {
        date: "2016-05-03",
        name: "Tom",
        state: "California",
        city: "Los Angeles",
        address: "No. 189, Grove St, Los Angeles",
        zip: "CA 90036",
      },
    ]);

    const deleteRow = (index) => {
      tableData.value.splice(index, 1);
    };

    const onAddItem = () => {
      now.setDate(now.getDate() + 1);
      tableData.value.push({
        date: dayjs(now).format("YYYY-MM-DD"),
        name: "Tom",
        state: "California",
        city: "Los Angeles",
        address: "No. 189, Grove St, Los Angeles",
        zip: "CA 90036",
      });
    };
    return { deleteRow, onAddItem, tableData };
  },
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.chart-content {
  border-radius: 4px;
  height: 260px;
  left: 2px;
}
.bg-purple {
  background-color: black;
}
.table-content {
  border-radius: 4px;
  height: 460px;
  left: 2px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow-y: fixed;
}
.table-in {
  height: 100%;
  max-height: 100%;
}
</style>
