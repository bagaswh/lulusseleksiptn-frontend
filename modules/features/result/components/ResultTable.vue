<template>
  <div class="result-table">
    <div class="table-wrapper">
      <v-data-table
        fixed-header
        :headers="headersComputed"
        :items="resultComputed"
        :options.sync="options"
        :server-items-length="resultMetadataComputed.total_rows"
        :loading="loading"
        class="table elevation-1"
        :class="{ 'large-data-table': !$vuetify.breakpoint.mobile }"
        multi-sort
      >
        <template v-slot:top="{ pagination, options, updateOptions }">
          <v-data-footer
            :pagination="pagination"
            :options="options"
            items-per-page-text="$vuetify.dataTable.itemsPerPageText"
            @update:options="updateOptions"
          />
        </template>

        <template v-slot:item.test_type="{ item }">
          <v-chip :color="getTestTypeColor(item.test_type)" dark>{{
            getTestLabel(item.test_type)
          }}</v-chip>
        </template>

        <template v-slot:item.major_group="{ item }">
          <v-chip
            v-if="item.major_group"
            :color="getMajorGroupColor(item.major_group)"
            dark
            >{{ getMajorGroupLabel(item.major_group) }}</v-chip
          >
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import pick from 'lodash/pick';

export default {
  props: {
    headers: {
      type: Array,
      default() {
        return [];
      },
    },

    result: {
      type: Array,
      default() {
        return [];
      },
    },

    resultMetadata: {
      type: Object,
      default() {
        return {};
      },
    },

    loading: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },

  data() {
    return {
      options: {},
    };
  },

  computed: {
    resultComputed() {
      return this.result;
    },

    resultMetadataComputed() {
      return this.resultMetadata;
    },

    headersComputed() {
      return this.headers;
    },
  },

  watch: {
    options: {
      deep: true,
      handler(val) {
        const params = {};
        Object.keys(
          pick(val, ['page', 'itemsPerPage', 'sortBy', 'sortDesc'])
        ).forEach((key) => {
          const map = {
            itemsPerPage: 'page_size',
            sortBy: 'sort_by',
            sortDesc: 'sort_desc',
          };
          params[map[key] || key] = val[key];
        });
        this.$emit('options-change', params);
      },
    },
  },

  created() {},

  methods: {
    getTestTypeColor(type) {
      const colors = ['orange', 'green'];
      return colors[type - 1];
    },

    getTestLabel(type) {
      const labels = ['SBMPTN', 'SNMPTN'];
      return labels[type - 1];
    },

    getMajorGroupLabel(group) {
      const labels = ['SOSHUM', 'SAINTEK'];
      return labels[group - 1];
    },

    getMajorGroupColor(group) {
      const colors = ['blue', 'purple'];
      return colors[group - 1];
    },
  },
};
</script>

<style>
.large-data-table {
  /* min-width: 100vw; */
}

.table-wrapper {
  overflow: auto;
  max-width: 100%;
}
</style>
