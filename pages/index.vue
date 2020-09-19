<template>
  <v-row>
    <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
      <div>
        <v-text-field
          v-model="searchQuery"
          outlined
          label="Cari nama"
          append-icon="mdi-search"
        ></v-text-field>
      </div>
      <v-menu
        transition="slide-y-transition"
        bottom
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-card class="mb-3" v-bind="attrs" v-on="on">
            <v-card-title>Filter</v-card-title>
          </v-card>
        </template>
        <v-form ref="form" class="px-5 py-5">
          <div class="px-0 py-0 filters mb-7">
            <span v-for="(value, key) in filters" :key="key">
              <v-chip
                v-if="value"
                close
                class="mr-3"
                @click:close="filters[key] = undefined"
              >
                {{ key }}: {{ filters[key] }}
              </v-chip>
            </span>
          </div>

          <v-select
            v-model="filters.test_type"
            item-text="label"
            item-value="code"
            :items="[
              { label: 'SBMPTN', code: 1 },
              { label: 'SNMPTN', code: 2 },
            ]"
            label="Jalur"
            outlined
          >
          </v-select>

          <v-select
            v-model="filters['majors.group']"
            item-text="label"
            item-value="code"
            :items="[
              { label: 'SOSHUM', code: 1 },
              { label: 'SAINTEK', code: 2 },
            ]"
            label="Kelompok"
            outlined
          >
          </v-select>
        </v-form>
      </v-menu>

      <result-table
        :loading="states.isLoadingResult"
        :headers="tableHeaders"
        :result="result"
        :result-metadata="resultMetadata"
        @options-change="optionsChanged($event)"
      />
    </v-col>
  </v-row>
</template>

<script>
import debounce from 'lodash/debounce';
import ResultTable from '~/modules/features/result/components/ResultTable.vue';

export default {
  components: { ResultTable },

  data() {
    return {
      tableHeaders: [
        { text: 'ID Siswa', value: 's_id' },
        { text: 'Nama', value: 's_name' },
        { text: 'Jalur', value: 'test_type' },
        { text: 'Universitas', value: 'uni_name' },
        { text: 'Prodi', value: 'major_name' },
        { text: 'Kelompok', value: 'major_group' },
        { text: 'Tahun', value: 'year' },
      ],
      result: [],
      resultMetadata: {},
      tableOptions: {},
      filters: {
        'majors.group': undefined,
        test_type: undefined,
      },
      states: {
        isLoadingResult: false,
      },
      searchQuery: '',
    };
  },

  watch: {
    tableOptions: {
      deep: true,
      handler(val) {
        this.loadResult();
      },
    },

    filters: {
      deep: true,
      handler(val) {
        this.loadResult();
      },
    },

    searchQuery(val) {
      if (val) {
        this.debouncedLoadResult();
      } else {
        this.loadResult();
      }
    },
  },

  created() {
    this.loadResult();

    this.debouncedLoadResult = debounce(this.loadResult.bind(this), 500);
  },

  methods: {
    optionsChanged(tableOptions) {
      this.tableOptions = tableOptions;
    },

    async getResult() {
      if (this.searchQuery) {
        const result = await this.$api.result.search({
          params: {
            q: this.searchQuery,
            ...this.tableOptions,
            ...this.filters,
          },
        });
        return result;
      }

      const result = await this.$api.result.all({
        params: { ...this.tableOptions, ...this.filters },
      });
      return result;
    },

    async loadResult() {
      this.states.isLoadingResult = true;
      try {
        const result = await this.getResult();
        this.result = result.records;
        this.resultMetadata = result.metadata;
      } catch (err) {
      } finally {
        this.states.isLoadingResult = false;
      }
    },
  },
};
</script>
