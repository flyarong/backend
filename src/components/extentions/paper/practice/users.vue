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
          <Cell :width="24">
            <textarea style="width: 100%" v-model="mobiles" placeholder="一行一个手机号"></textarea>
          </Cell>
          <Cell :width="24">
            <p-button glass="h-btn h-btn-primary" permission="addons.Paper.practice.user.insert" text="添加用户" @click="userAdd()"></p-button>
            <Button class="h-btn h-btn-primary" @click="exportXlsx">导出记录</Button>
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
          <TableItem title="已练习" :width="200">
            <template slot-scope="{ data }"> {{ data.submit_count }}题 </template>
          </TableItem>
          <TableItem title="练习进度" :width="200">
            <template slot-scope="{ data }">
              <span v-if="questionCount === 0">0%</span>
              <span v-else>{{ ((data.submit_count / questionCount) * 100).toFixed(2) }}%</span>
            </template>
          </TableItem>
          <TableItem title="操作" align="center" :width="200">
            <template slot-scope="{ data }">
              <ButtonGroup>
                <p-del-button permission="addons.Paper.practice.user.delete" @click="remove(data)"></p-del-button>
                <p-button
                  glass="h-btn h-btn-s h-btn-primary"
                  permission="addons.Paper.practice.user.progress"
                  text="练习进度"
                  @click="showProgress(data)"
                ></p-button>
              </ButtonGroup>
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
      questionCount: 0,
      datas: [],
      loading: false,
      mobiles: ''
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
      let data = this.pagination;
      data.id = this.id;
      R.Extentions.paper.Practice.Users(data).then(resp => {
        this.datas = resp.data.data.data;
        this.pagination.total = resp.data.data.total;

        this.questionCount = resp.data.question_count;

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
    },
    showProgress(item) {
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['./user_progress'], resolve);
          },
          datas: {
            id: this.id,
            user_id: item.user_id
          }
        },
        events: {
          success: modal => {
            modal.close();
          }
        }
      });
    },
    exportXlsx() {
      this.loading = true;
      R.Extentions.paper.Practice.Users({
        page: 1,
        size: 20000,
        id: this.id
      }).then(resp => {
        this.loading = false;

        if (resp.data.data.total === 0) {
          HeyUI.$$Message.warn('暂无数据');
          return;
        }

        let data = resp.data.data.data;
        let questionCount = resp.data.question_count;

        let filename = '练习进度|' + Utils.currentDate() + '.xlsx';
        let sheetName = 'sheet1';

        let rows = [['用户ID', '用户名', '手机号', '已练习题目数', '进度']];
        data.forEach(item => {
          if (!item.user) {
            return;
          }

          let p = questionCount === 0 ? 0 : ((item.submit_count / questionCount) * 100).toFixed(2);

          rows.push([item.user_id, item.user.nick_name, item.user.mobile, item.submit_count, p + '%']);
        });

        Utils.exportExcel(rows, filename, sheetName);
      });
    }
  }
};
</script>
