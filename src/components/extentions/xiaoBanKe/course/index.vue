<template>
  <div class="table-basic-vue frame-page h-panel">
    <div class="h-panel-bar">
      <span class="h-panel-title">课程</span>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="4">
              <FormItem label="课程ID">
                <input type="text" v-model="cond.id" placeholder="课程ID" />
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem label="搜索">
                <input type="text" v-model="cond.keywords" placeholder="课程标题" />
              </FormItem>
            </Cell>
            <Cell :width="4">
              <FormItem label="课程类型">
                <Select v-model="cond.type" :datas="typeMap" keyName="key" titleName="title"></Select>
              </FormItem>
            </Cell>
            <Cell :width="4">
              <FormItem label="状态">
                <Select v-model="cond.status" :datas="statusMap" keyName="key" titleName="title"></Select>
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem>
                <Button class="h-btn h-btn-primary" @click="getData(true)">搜索</Button>
                <Button class="h-btn" @click="reset()">重置</Button>
              </FormItem>
            </Cell>
          </Row>
        </Form>
      </div>
      <div class="float-box mb-10">
        <p-button glass="h-btn h-btn-primary" permission="addons.XiaoBanKe.course.store" text="添加课程" @click="create()"></p-button>
        <p-button
          glass="h-btn h-btn-primary"
          permission="addons.XiaoBanKe.course_category.list"
          text="课程分类"
          @click="showCategoryPage()"
        ></p-button>
      </div>
      <div class="float-box mb-10">
        <Table :loading="loading" :datas="datas">
          <TableItem prop="id" title="课程ID" :width="100"></TableItem>
          <TableItem prop="type_text" title="类型" :width="100"></TableItem>
          <TableItem title="分类" :width="150">
            <template slot-scope="{ data }">
              <span v-if="data.category">{{ data.category.name }}</span>
              <span v-else class="red">已删除</span>
            </template>
          </TableItem>
          <TableItem title="状态" :width="100">
            <template slot-scope="{ data }">
              <span class="red">{{ data.status_text }}</span>
            </template>
          </TableItem>
          <TableItem prop="title" title="课程名" :width="500"></TableItem>
          <TableItem title="价格" unit="元" :width="120">
            <template slot-scope="{ data }">
              <span>￥{{ data.charge }}</span> /
              <span style="text-decoration: line-through">￥{{ data.original_charge }}</span>
            </template>
          </TableItem>
          <TableItem title="已报名/上限" :width="120">
            <template slot-scope="{ data }">
              <span>{{ data.join_people_num || 0 }}</span
              >/
              <span>{{ data.max_people_num }}</span>
            </template>
          </TableItem>
          <TableItem title="开课/结课" :width="400">
            <template slot-scope="{ data }">
              <span>{{ data.open_at }}</span>
              <span>/</span>
              <span>{{ data.over_at }}</span>
            </template>
          </TableItem>
          <TableItem title="操作" align="center" :width="200" fixed="right">
            <template slot-scope="{ data }">
              <ButtonGroup>
                <p-del-button permission="addons.XiaoBanKe.course.delete" @click="remove(datas, data)"></p-del-button>
                <p-button glass="h-btn h-btn-s h-btn-primary" permission="addons.XiaoBanKe.course.edit" text="编辑" @click="edit(data)"></p-button>
                <p-button
                  glass="h-btn h-btn-primary h-btn-s"
                  permission="addons.XiaoBanKe.order.list"
                  text="订单"
                  @click="showOrderPage(data)"
                ></p-button>
              </ButtonGroup>
            </template>
          </TableItem>
        </Table>
      </div>

      <div class="float-box mb-10">
        <Pagination align="right" v-model="pagination" @change="changePage" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      datas: [],
      pagination: {
        page: 1,
        size: 10,
        total: 0
      },
      cond: {
        keywords: null,
        id: null,
        cid: null,
        status: -1,
        type: -1
      },
      loading: false,
      statusMap: [],
      typeMap: [],
      categories: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    reset() {
      this.cond.keywords = null;
      this.cond.id = null;
      this.cond.cid = null;
      this.cond.status = -1;
      this.cond.type = -1;
      this.getData(true);
    },
    changePage() {
      this.getData();
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      let data = this.pagination;
      Object.assign(data, this.cond);
      R.Extentions.xiaoBanKe.Course.List(data).then(resp => {
        this.datas = resp.data.data.data;
        this.pagination.total = resp.data.data.total;
        this.statusMap = resp.data.statusMap;
        this.typeMap = resp.data.typeMap;
        this.categories = resp.data.categories;
        this.loading = false;
      });
    },
    create() {
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['./create'], resolve);
          }
        },
        events: {
          success: (modal, data) => {
            modal.close();
            HeyUI.$Message.success('成功');
            this.getData(true);
          }
        }
      });
    },
    remove(data, item) {
      R.Extentions.xiaoBanKe.Course.Delete({ id: item.id }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData(true);
      });
    },
    edit(item) {
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['./edit'], resolve);
          },
          datas: {
            id: item.id
          }
        },
        events: {
          success: (modal, data) => {
            modal.close();
            HeyUI.$Message.success('成功');
            this.getData(true);
          }
        }
      });
    },

    showCategoryPage() {
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['../course_category/index'], resolve);
          }
        }
      });
    },
    showOrderPage(item) {
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['../order/index'], resolve);
          },
          datas: {
            id: item.id
          }
        }
      });
    }
  }
};
</script>
