<template>
  <div class="h-panel w-1200">
    <div class="h-panel-bar">
      <span class="h-panel-title">分类</span>
      <div class="h-panel-right">
        <p-button glass="h-btn h-btn-primary" permission="addons.meedu_topics.category.store" text="添加" @click="create()"></p-button>
        <Button @click="$emit('close')" :text="true">取消</Button>
      </div>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Table :loading="loading" :datas="datas">
          <TableItem prop="id" title="ID" :width="100"></TableItem>
          <TableItem prop="sort" title="升序" :width="100"></TableItem>
          <TableItem prop="name" title="分类名" :width="500"></TableItem>
          <TableItem title="操作" align="center" :width="200" fixed="right">
            <template slot-scope="{ data }">
              <ButtonGroup>
                <p-del-button permission="addons.meedu_topics.category.delete" @click="remove(datas, data)"></p-del-button>
                <p-button
                  glass="h-btn h-btn-s h-btn-primary"
                  permission="addons.meedu_topics.category.update"
                  text="编辑"
                  @click="edit(data)"
                ></p-button>
              </ButtonGroup>
            </template>
          </TableItem>
        </Table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      datas: [],
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
      R.Extentions.meeduTopics.Category.List(this.pagination).then(resp => {
        this.datas = resp.data;
        this.loading = false;
      });
    },
    create() {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
        component: {
          vue: resolve => {
            require(['./create'], resolve);
          }
        },
        events: {
          success: (modal, data) => {
            R.Extentions.meeduTopics.Category.Store(data).then(resp => {
              modal.close();
              HeyUI.$Message.success('成功');
              this.getData(true);
            });
          }
        }
      });
    },
    remove(data, item) {
      R.Extentions.meeduTopics.Category.Delete({ id: item.id }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData(true);
      });
    },
    edit(item) {
      this.$Modal({
        closeOnMask: false,
        hasCloseIcon: true,
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
            R.Extentions.meeduTopics.Category.Update(data).then(resp => {
              modal.close();
              HeyUI.$Message.success('成功');
              this.getData(true);
            });
          }
        }
      });
    }
  }
};
</script>
