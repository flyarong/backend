<template>
  <div class="h-panel w-1000">
    <div class="h-panel-bar">
      <span class="h-panel-title">聊天室内容</span>
      <div class="h-panel-right">
        <Button @click="$emit('close')" :text="true">取消</Button>
      </div>
    </div>
    <div class="h-panel-body">
      <div class="mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="6">
              <FormItem label="UID">
                <user-filter v-model="filter.user_id"></user-filter>
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem>
                <Button color="primary" @click="getData(true)">搜索</Button>
                <Button class="h-btn" @click="reset">重置</Button>
              </FormItem>
            </Cell>
          </Row>
        </Form>
      </div>

      <div class="float-box mb-10">
        <Button class="h-btn h-btn-s h-btn-primary" @click="getData(true)">刷新数据</Button>
        <p-del-button permission="addons.Zhibo.chat.delete" text="批量删除" @click="deleteSubmit()"></p-del-button>
      </div>
      <div class="float-box mb-10">
        <Table :loading="loading" :datas="datas" ref="table" :checkbox="true">
          <TableItem title="用户ID" prop="user_id" :width="100"></TableItem>
          <TableItem title="用户">
            <template slot-scope="{ data }">
              <span v-if="data.user">{{ data.user.nick_name }}</span>
              <span class="red" v-else>已删除</span>
            </template>
          </TableItem>
          <TableItem title="内容" prop="content"></TableItem>
          <TableItem title="时间" prop="created_at" :width="200"></TableItem>
        </Table>
      </div>

      <div class="float-box mb-10">
        <Pagination class="mt-10" align="right" v-model="pagination" @change="changePage" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['course_id', 'video_id'],
  data() {
    return {
      datas: [],
      filter: {
        user_id: 0
      },
      pagination: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false
    };
  },
  mounted() {
    this.getData(true);
  },
  methods: {
    reset() {
      this.filter.user_id = 0;
      this.getData(true);
    },
    changePage() {
      this.getData();
    },
    getData(reset = false) {
      if (reset) {
        this.pagination.page = 1;
      }
      this.loading = true;
      let data = this.pagination;
      Object.assign(data, {
        course_id: this.course_id,
        video_id: this.video_id
      });
      Object.assign(data, this.filter);
      R.Extentions.zhibo.CourseChat.List(data).then(resp => {
        this.datas = resp.data.data;
        this.pagination.total = resp.data.total;
        this.loading = false;
      });
    },
    deleteSubmit() {
      let items = this.$refs.table.getSelection();
      if (items.length === 0) {
        this.$Message.error('请选择需要删除的数据');
        return;
      }
      this.loading = true;
      let ids = [];
      for (let i = 0; i < items.length; i++) {
        ids.push(items[i].id);
      }
      R.Extentions.zhibo.CourseChat.Delete({ ids: ids }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData();
      });
    }
  }
};
</script>
