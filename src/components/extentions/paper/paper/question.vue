<style lang="less" scoped>
.banner {
  text-align: center;

  .title {
    width: 100%;
    height: auto;
    float: left;
    font-size: 18px;
    line-height: 40px;
  }

  .value {
    width: 100%;
    height: auto;
    float: left;
    font-size: 24px;
    font-weight: 600;
    color: #000;
    line-height: 64px;
  }
}
</style>
<template>
  <div class="h-panel w-1000">
    <div class="h-panel-bar">
      <span class="h-panel-title">设置习题</span>
      <div class="h-panel-right">
        <Button @click="$emit('close')" :text="true">取消</Button>
      </div>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <Row>
          <Cell :width="12" class="banner">
            <div class="title">总分</div>
            <div class="value">{{ totalScore }}分</div>
          </Cell>
          <Cell :width="12" class="banner">
            <div class="title">试题</div>
            <div class="value">{{ data.length }}道</div>
          </Cell>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['id'],
  data() {
    return {
      questions: [],
      s: [],
      category_id: null,
      categories: [],
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
      for (let i = 0; i < this.data.length; i++) {
        score += this.data[i].score;
      }
      return score;
    }
  },
  methods: {
    categoryChange() {
      this.getData();
    },
    getData() {
      R.Extentions.paper.Paper.Questions({
        id: this.id,
        category_id: this.category_id
      }).then(res => {
        this.questions = res.data.questions;
        this.categories = res.data.categories;
        this.data = res.data.data;
      });
    },
    deleteQuestion(question) {
      R.Extentions.paper.Paper.DelQuestion({ id: this.id, question_id: question.id }).then(res => {
        this.$Message.success('成功');
        this.getData();
      });
    },
    addQuestion(question) {
      R.Extentions.paper.Paper.AddQuestions({ id: this.id, s: [question.id] }).then(res => {
        this.$Message.success('成功');
        this.getData();
        this.s = [];
      });
    }
  }
};
</script>
