<style lang="less" scoped>
.questions-box {
  width: 100%;
  height: auto;
  float: left;
  margin-bottom: 15px;
  border: 1px solid rgba(0, 0, 0, 0.05);

  .title {
    width: 100%;
    height: auto;
    float: left;
    line-height: 45px;
    font-size: 15px;
    color: rgba(0, 0, 0, 0.8);
    font-weight: bolder;
    padding-left: 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .list-box {
    width: 100%;
    height: auto;
    float: left;
    padding: 15px;

    .question-item {
      width: 100%;
      height: auto;
      float: left;
      margin-bottom: 15px;
      padding: 10px;
      background-color: rgba(0, 0, 0, 0.02);

      &:last-child {
        margin-bottom: 0;
      }

      .info {
        width: 100%;
        height: auto;
        float: left;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.5);
        margin-bottom: 10px;
      }

      .content {
        width: 100%;
        height: auto;
        float: left;
      }

      &:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.03);
      }
    }
  }
}
</style>
<template>
  <div class="h-panel w-1200">
    <div class="h-panel-bar">
      <span class="h-panel-title">设置习题</span>
      <div class="h-panel-right">
        <Button @click="$emit('success')" :text="true">取消</Button>
      </div>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <p-button glass="h-btn h-btn-primary" permission="addons.Paper.paper.questions.add" text="添加试题" @click="addQuestion()"></p-button>
      </div>
      <div class="float-box mb-10" style="padding-top: 5px">
        <span>总分：{{ totalScore }}分</span>
      </div>
      <div class="float-box mb-10">
        <warn text="点击试题即可删除" />
      </div>
      <div class="float-box mb-10">
        <div class="questions-box" v-for="(list, typeText) in data" :key="typeText">
          <div class="title">{{ typeText }}&nbsp;(共{{ list.length }}题)</div>
          <div class="list-box">
            <div class="question-item" @click="deleteQuestion(item)" v-for="item in list" :key="item.id">
              <div class="info">ID:{{ item.id }}&nbsp;|&nbsp;{{ item.score }}分&nbsp;|&nbsp;{{ item.level_text }}</div>
              <div class="content">
                <div v-html="item.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['id'],
  data() {
    return {
      data: [],
      loading: false
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    totalScore() {
      let score = 0;
      for (let index in this.data) {
        let list = this.data[index];
        for (let i = 0; i < list.length; i++) {
          score += list[i].score;
        }
      }
      return score;
    }
  },
  methods: {
    getData() {
      R.Extentions.paper.Paper.Questions({
        id: this.id
      }).then(res => {
        this.data = res.data.questions;
      });
    },
    deleteQuestion(question) {
      if (confirm('确认删除该试题？')) {
        R.Extentions.paper.Paper.DelQuestion({ id: this.id, question_id: question.id }).then(res => {
          this.$Message.success('成功');
          this.getData();
        });
      }
    },
    addQuestion() {
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
            this.getData();
            modal.close();
          }
        }
      });
    }
  }
};
</script>
