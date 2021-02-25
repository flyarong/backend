<template>
  <div class="h-panel w-1200">
    <div class="h-panel-bar">
      <span class="h-panel-title">参与用户</span>
      <div class="h-panel-right">
        <Button @click="$emit('close')" :text="true">取消</Button>
      </div>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Row :space="10">
          <Cell :width="20">
            <textarea style="width: 100%" v-model="mobiles" placeholder="一行一个手机号"></textarea>
          </Cell>
          <Cell :width="4">
            <p-button glass="h-btn h-btn-primary" permission="addons.Paper.practice.user.insert" text="添加用户" @click="userAdd()"></p-button>
          </Cell>
        </Row>
      </div>
      <div class="float-box mb-10">
        <Table ref="table" :loading="loading" :datas="datas">
          <TableItem title="用户ID" :width="120">
            <template slot-scope="{ data }">
              {{ data.user_id }}
            </template>
          </TableItem>
          <TableItem title="用户">
            <template slot-scope="{ data }">
              <span v-if="data.user">{{ data.user.nick_name }}</span>
              <span v-else class="red">已删除</span>
            </template>
          </TableItem>
          <TableItem title="操作" align="center" :width="100">
            <template slot-scope="{ data }">
              <p-del-button permission="addons.Paper.practice.user.delete" @click="remove(data)"></p-del-button>
            </template>
          </TableItem>
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
  props: ['id'],
  data() {
    return {
      pagination: {
        page: 1,
        size: 10,
        total: 0
      },
      datas: [],
      loading: false,
      mobiles: ''
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      let data = this.pagination;
      data.id = this.id;
      R.Extentions.paper.Practice.Users(data).then(resp => {
        this.datas = resp.data.data.data;
        this.pagination.total = resp.data.data.total;

        this.loading = false;
      });
    },
    userAdd() {
      if (this.mobiles.length === 0) {
        this.$Message.error('请输入用户手机号');
        return;
      }
      let mobiles = this.mobiles.trim().split('\n');
      if (mobiles.length === 0) {
        this.$Message.error('请输入用户手机号');
        return;
      }
      R.Extentions.paper.Practice.AddUser({ mobiles: mobiles, id: this.id }).then(() => {
        HeyUI.$Message.success('成功');
        this.mobiles = '';
        this.getData(true);
      });
    },
    remove(item) {
      R.Extentions.paper.Practice.DelUser({ id: this.id, user_id: item.user_id }).then(() => {
        HeyUI.$Message.success('成功');
        this.getData(true);
      });
    }
  }
};
</script>
