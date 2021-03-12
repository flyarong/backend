<style lang="less" scoped>
.banner {
  text-align: center;

  .title {
    width: 100%;
    height: auto;
    float: left;
    font-size: 15px;
    line-height: 30px;
    color: rgba(0, 0, 0, 0.5);
  }

  .value {
    width: 100%;
    height: auto;
    float: left;
    font-size: 22px;
    font-weight: 600;
    line-height: 44px;
    color: rgba(0, 0, 0, 0.8);
  }
}
</style>
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
            <p-button glass="h-btn h-btn-primary" permission="addons.Paper.paper.users.add" text="添加用户" @click="userAdd()"></p-button>
          </Cell>
        </Row>
      </div>
      <div class="float-box mb-10">
        <Row>
          <Cell :width="3">
            <div class="banner">
              <div class="title">总分</div>
              <div class="value">{{ totalScore }}分</div>
            </div>
          </Cell>
          <Cell :width="3">
            <div class="banner">
              <div class="title">及格分</div>
              <div class="value">{{ passScore }}分</div>
            </div>
          </Cell>
          <Cell :width="3">
            <div class="banner">
              <div class="title">最低分</div>
              <div class="value">{{ stat.min }}分</div>
            </div>
          </Cell>
          <Cell :width="3">
            <div class="banner">
              <div class="title">最高分</div>
              <div class="value">{{ stat.max }}分</div>
            </div>
          </Cell>
          <Cell :width="3">
            <div class="banner">
              <div class="title">平均分</div>
              <div class="value">{{ stat.average }}分</div>
            </div>
          </Cell>
          <Cell :width="3">
            <div class="banner">
              <div class="title">及格率</div>
              <div class="value">{{ stat.pass_rate }}%</div>
            </div>
          </Cell>
          <Cell :width="3">
            <div class="banner">
              <div class="title">及格人数</div>
              <div class="value">{{ stat.pass_count }}人</div>
            </div>
          </Cell>
          <Cell :width="3">
            <div class="banner">
              <div class="title">总人数</div>
              <div class="value">{{ datas.length }}人</div>
            </div>
          </Cell>
        </Row>
      </div>
      <div class="float-box mb-10">
        <Table ref="table" :loading="loading" :datas="datas">
          <TableItem title="用户" :width="120">
            <template slot-scope="{ data }">
              <span v-if="typeof users[data.user_id] === 'undefined'" class="red">已删除</span>
              <span v-else>{{ users[data.user_id].nick_name }}</span>
            </template>
          </TableItem>
          <TableItem title="最高得分" :width="100">
            <template slot-scope="{ data }">
              <span>{{ data.score }}分</span>
            </template>
          </TableItem>
          <TableItem title="及格" :width="80">
            <template slot-scope="{ data }">
              <span v-if="data.score >= passScore">是</span>
              <span v-else class="red">不及格</span>
            </template>
          </TableItem>
          <TableItem title="操作" align="center" :width="150">
            <template slot-scope="{ data }">
              <p-del-button permission="addons.Paper.paper.users.delete" @click="remove(data)"></p-del-button>
            </template>
          </TableItem>
        </Table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['id'],
  data() {
    return {
      datas: [],
      loading: false,
      mobiles: '',
      users: [],
      token: '',
      totalScore: 0,
      passScore: 0,
      stat: {
        min: 0,
        max: 0,
        average: 0,
        pass_rate: 0,
        pass_count: 0
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      let data = {
        id: this.id
      };
      R.Extentions.paper.Paper.Users(data).then(resp => {
        this.datas = resp.data.data;
        this.loading = false;
        this.passScore = resp.data.pass_score;
        this.users = resp.data.users;

        this.stat = resp.data.stat;
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
      R.Extentions.paper.Paper.UserAdd({ mobiles: mobiles, id: this.id }).then(resp => {
        HeyUI.$Message.success('成功');
        this.mobiles = '';
        this.getData(true);
      });
    },
    remove(item) {
      R.Extentions.paper.Paper.UserDel({ id: this.id, user_id: item.user_id }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData(true);
      });
    }
  }
};
</script>
