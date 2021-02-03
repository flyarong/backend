<template>
  <div class="h-panel w-1200">
    <div class="h-panel-bar">
      <span class="h-panel-title">章节试题</span>
      <div class="h-panel-right">
        <Button @click="$emit('close')" :text="true">取消</Button>
      </div>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Form>
          <Row :space="10">
            <Cell :width="6">
              <FormItem label="分类">
                <Select v-model="filter.category_id" :datas="categories" keyName="id" titleName="name" :filterable="true"></Select>
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem label="类型">
                <Select v-model="filter.type" :datas="types" keyName="id" titleName="name" :filterable="true"></Select>
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem label="难度">
                <Select v-model="filter.level" :datas="levels" keyName="id" titleName="name" :filterable="true"></Select>
              </FormItem>
            </Cell>
            <Cell :width="6">
              <FormItem>
                <Button color="primary" @click="getData(true)">过滤</Button>
                <Button @click="resetFilter()">重置</Button>
              </FormItem>
            </Cell>
          </Row>
        </Form>
      </div>
      <div class="float-box mb-10">
        <ButtonGroup>
          <p-button
            glass="h-btn h-btn-primary h-btn-s"
            permission="addons.Paper.practice_chapter.questions.store"
            text="添加"
            @click="create()"
          ></p-button>
          <p-del-button permission="addons.Paper.practice_chapter.questions.delete" text="批量移除" @click="deleteSubmit()"></p-del-button>
        </ButtonGroup>
      </div>
      <div class="float-box mb-10">
        <Table ref="table" :loading="loading" :checkbox="true" :datas="datas">
          <TableItem title="ID" :width="120">
            <template slot-scope="{ data }">
              {{ data.id }}
            </template>
          </TableItem>
          <TableItem title="分类" :width="150">
            <template slot-scope="{ data }">
              <span v-if="data.category">{{ data.category.name }}</span>
              <span v-else class="red">已删除</span>
            </template>
          </TableItem>
          <TableItem title="类型" :width="120">
            <template slot-scope="{ data }">
              {{ data.type_text }}
            </template>
          </TableItem>
          <TableItem title="难度" :width="100">
            <template slot-scope="{ data }">
              {{ data.level_text }}
            </template>
          </TableItem>
          <TableItem title="内容">
            <template slot-scope="{ data }">
              <div v-html="data.content"></div>
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
      filter: {
        category_id: null,
        id: this.id,
        type: null,
        level: null
      },
      datas: [],
      categories: [],
      types: [],
      levels: [],
      loading: false
    };
  },
  mounted() {
    this.getData(true);
  },
  methods: {
    changePage() {
      this.getData();
    },
    resetFilter() {
      this.filter.category_id = null;
      this.filter.type = null;
      this.filter.level = null;
      this.getData(true);
    },
    getData(reset = false) {
      this.loading = true;
      if (reset) {
        this.pagination.page = 1;
      }
      let data = this.pagination;
      Object.assign(data, this.filter);
      R.Extentions.paper.PracticeChapter.Questions(data).then(resp => {
        this.loading = false;

        this.datas = resp.data.data.data;
        this.pagination.total = resp.data.data.total;

        this.categories = resp.data.categories;
        this.types = resp.data.types;
        this.levels = resp.data.levels;
      });
    },
    create() {
      this.$Modal({
        hasCloseIcon: true,
        closeOnMask: false,
        component: {
          vue: resolve => {
            require(['./question_add'], resolve);
          },
          datas: {
            id: this.id
          }
        },
        events: {
          success: (modal, data) => {
            modal.close();
            this.getData();
          }
        }
      });
    },
    addQuestion(quesiton) {
      R.Extentions.paper.PracticeChapter.QuestionsStore({ id: this.id, qids: [quesiton.id] }).then(resp => {
        HeyUI.$Message.success('成功');
        this.getData();
      });
    },
    deleteSubmit() {
      let items = this.$refs.table.getSelection();
      if (items.length === 0) {
        this.$Message.error('请选择操作数据');
        return;
      }
      this.loading = true;
      let ids = [];
      for (let i = 0; i < items.length; i++) {
        ids.push(items[i].id);
      }
      R.Extentions.paper.PracticeChapter.QuestionsDelete({ id: this.id, qids: ids }).then(() => {
        HeyUI.$Message.success('成功');
        this.getData();
      });
    }
  }
};
</script>
