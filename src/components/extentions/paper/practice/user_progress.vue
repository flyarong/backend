<template>
  <div class="h-panel w-1200">
    <div class="h-panel-bar">
      <span class="h-panel-title"
        ><b v-if="user">{{ user.nick_name }}</b
        >的练习进度</span
      >
      <div class="h-panel-right">
        <Button @click="$emit('close')" :text="true">关闭</Button>
      </div>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Table ref="table" :loading="loading" :datas="datas">
          <TableItem title="章节" prop="chapter_name" :width="200"></TableItem>
          <TableItem title="题目数" prop="question_count" unit="题" :width="200"></TableItem>
          <TableItem title="已练习" prop="submit_count" unit="题" :width="200"></TableItem>
          <TableItem title="进度" :width="200">
            <template slot-scope="{ data }">
              <span v-if="data.question_count === 0">0%</span>
              <span v-else>{{ (data.submit_count / data.question_count).toFixed(2) * 100 }}%</span>
            </template>
          </TableItem>
        </Table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['id', 'user_id'],
  data() {
    return {
      datas: [],
      user: null,
      loading: false
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    changePage() {
      this.getData();
    },
    getData() {
      this.loading = true;
      R.Extentions.paper.Practice.UserProgress(this.id, this.user_id).then(resp => {
        this.datas = resp.data.data;
        this.user = resp.data.user;

        this.loading = false;
      });
    }
  }
};
</script>
